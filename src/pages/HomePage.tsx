/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../pages/styles/Homepage.module.scss";
import {
	getCategories,
	getPerformanceByCategory,
	getSettings,
	toggleVotePermit,
	votePerformance,
} from "../services/userService";
import socket from "../socket/socket";
import {
	selectVotingEnabledByCategory,
	setCategories,
	setVotingState,
} from "../store/slices/categorySlice";
import { setPerformances, updateVote } from "../store/slices/performanceSlice";
import { logout, selectIsAuthenticated } from "../store/slices/userSlice";
import { Settings } from "../types/Settings";

// Danh sách màu sắc khác nhau cho từng performance
const colors = ["#ff4d4f", "#40a9ff", "#36cfc9", "#ffec3d", "#9254de"];

const HomePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const performances = useSelector(
		(state: any) => state.performance.performances,
	);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const categories = useSelector((state: any) => state.category.categories);
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [settingsData, setSettingsData] = useState<Settings>();
	const [backgroundImage, setBackgroundImage] = useState<string>("");

	const handleLogout = () => {
		dispatch(logout());
	};

	useEffect(() => {
		const updateBackground = () => {
			if (!settingsData) return;

			const isMobile = window.innerWidth <= 768;
			setBackgroundImage(
				isMobile ? settingsData.bgPhone : settingsData.bgDesktop,
			);
		};

		updateBackground(); // Gọi khi settingsData thay đổi
		window.addEventListener("resize", updateBackground);

		return () => {
			window.removeEventListener("resize", updateBackground);
		};
	}, [settingsData]);

	const fetchCategories = useCallback(async () => {
		try {
			const res = await getCategories();
			const data = res.data.data;
			dispatch(setCategories(data));
			setCategoryId(data[0].id);
		} catch (error) {
			console.log("Error fetching categories", error);
		}
	}, [dispatch]);

	const fetchSettings = useCallback(async () => {
		try {
			const res = await getSettings();
			const data = res.data.data;
			setSettingsData({
				bgDesktop: data[data.length - 1].bgDesktop,
				bgPhone: data[data.length - 1].bgPhone,
				buttonColor: data[data.length - 1].buttonColor,
				textColor: data[data.length - 1].textColor,
			});
		} catch (error) {
			console.log("Error adding performances", error);
		}
	}, []);

	const isVotingEnabled = useSelector((state: any) =>
		categoryId
			? selectVotingEnabledByCategory(state, categoryId.toString())
			: false,
	);

	const fetchPerformances = useCallback(async () => {
		if (categoryId === null) return;
		try {
			const res = await getPerformanceByCategory(categoryId);
			const data = res.data.data;
			dispatch(setPerformances(data));
		} catch (error) {
			console.error("Error fetching performances:", error);
		}
	}, [categoryId, dispatch]);

	useEffect(() => {
		fetchCategories();
		fetchSettings();
	}, [fetchCategories, fetchSettings]);

	useEffect(() => {
		if (categoryId !== null) {
			fetchPerformances();
		}
	}, [categoryId, fetchPerformances]);

	// Lắng nghe sự kiện từ WebSocket
	useEffect(() => {
		socket.on("voteUpdate", (data) => {
			dispatch(updateVote(data));
		});

		socket.on("votingStateChanged", (data) => {
			dispatch(setVotingState(data));
		});

		return () => {
			socket.off("voteUpdate");
			socket.off("votingStateChanged");
		};
	}, [dispatch]);

	const handleSelect = (id: string) => {
		setSelectedId((prevSelectedId) => (prevSelectedId === id ? null : id));
	};

	const handleVote = async () => {
		if (!selectedId || !isVotingEnabled) {
			return;
		}
		try {
			const payload = {
				categoryId: categoryId!,
			};
			await votePerformance(selectedId, payload);

			// Cập nhật lại tổng số lượng vote
			const updatedPerformances = performances.map((performance: any) =>
				performance.id === selectedId
					? { ...performance, vote: performance.vote + 1 }
					: performance,
			);

			// Cập nhật lại các tiết mục trong state
			dispatch(setPerformances(updatedPerformances));
		} catch (error) {
			console.error("Voting failed", error);
		}
	};

	const handleVotePermission = async () => {
		if (!categoryId) return;

		try {
			const newEnabled = !isVotingEnabled;
			await toggleVotePermit(categoryId.toString(), { enabled: newEnabled });

			dispatch(
				setVotingState({ id: categoryId.toString(), enabled: newEnabled }),
			);
		} catch (error) {
			console.error("Failed to toggle voting state", error);
		}
	};

	return (
		<div
			style={{
				padding: "40px",
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				minHeight: "100vh",
			}}
		>
			<div>
				<h1
					style={{
						margin: 0,
						fontSize: "2rem",
						textAlign: "center",
						color: settingsData?.textColor,
					}}
				>
					Kết Quả Bình Chọn
				</h1>
				<div
					style={{
						marginBottom: "24px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					{isAuthenticated ? (
						<div>
							<Button
								type="primary"
								onClick={handleVotePermission}
								className={`${styles.buttonCustom}`}
								style={{
									marginRight: "10px",
									backgroundColor: "#1890ff",
								}}
							>
								{isVotingEnabled ? "Dừng Bình Chọn" : "Mở Bình Chọn"}
							</Button>
							<Button
								type="primary"
								onClick={() => navigate("/config")}
								className={styles.buttonCustom}
								style={{
									marginRight: "10px",
									backgroundColor: "#52c41a",
									color: settingsData?.textColor,
								}}
							>
								Cài Đặt
							</Button>
							<Button
								type="primary"
								danger
								onClick={handleLogout}
								className={styles.buttonCustom}
							>
								Đăng Xuất
							</Button>
						</div>
					) : (
						<Button
							type="primary"
							onClick={() => navigate("/login")}
							className={`${styles.buttonCustom} ${styles.loginButton}`}
						>
							Login
						</Button>
					)}
				</div>
			</div>

			{/* Phần danh sách tiết mục */}
			<div
				style={{
					maxWidth: "80%",
					margin: "0 auto",
				}}
			>
				{performances.map((performance: any, index: number) => {
					const totalVotes = performances.reduce(
						(acc: number, p: any) => acc + p.vote,
						0,
					);
					const percentage =
						totalVotes > 0 ? (performance.vote / totalVotes) * 100 : 0;

					return (
						<div
							key={performance.id}
							style={{
								marginBottom: "4%",
								cursor: "pointer",
							}}
							onClick={() => handleSelect(performance.id)}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									marginBottom: "8px",
									border:
										selectedId === performance.id
											? "5px solid #1890ff"
											: "1px solid rgba(255, 255, 255, 0.3)",
									borderRadius: 30,
									// backgroundColor: "white",
									background: "rgba(255, 255, 255, 0.1)",
									boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
									backdropFilter: "blur(10px)",
									WebkitBackdropFilter: "blur(10px)", // Safari support
									padding: 10,
								}}
							>
								<div
									style={{
										width: "100px",
										fontWeight: "bold",
										fontSize: "1.3rem",
										color: colors[index % colors.length],
										marginLeft: "3%",
									}}
								>
									{performance.name}
								</div>
								<div
									style={{
										flex: 1,
										height: "30px",
										position: "relative",
									}}
								>
									<div
										style={{
											position: "absolute",
											left: 0,
											top: 0,
											height: "100%",
											width: `${percentage}%`,
											backgroundColor: colors[index % colors.length],
											borderRadius: "4px",
											transition: "width 0.3s ease",
											marginLeft: "5%",
											// border:
											// 	selectedId === performance.id
											// 		? "2px solid #1890ff"
											// 		: "none",
										}}
									/>
									<span
										style={{
											position: "absolute",
											right: "10px",
											top: "50%",
											transform: "translateY(-50%)",
											color: colors[index % colors.length],
											fontSize: "1.3rem",
											fontWeight: "bold",
											zIndex: 1,
										}}
									>
										{`${Math.round(percentage)}% (${performance.vote} votes)`}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Categories section */}
			<Row
				gutter={[16, 16]}
				style={{ marginTop: 40, justifyContent: "center" }}
			>
				{categories.map((category: any) => (
					<Col key={category.id}>
						<Button
							className={styles.buttonCustom}
							type={category.id === categoryId ? "primary" : "default"}
							style={{
								color: category.id === categoryId ? "#fff" : "#000",
								backgroundColor:
									category.id === categoryId ? "#1890ff" : "#d9d9d9",
							}}
							onClick={() => setCategoryId(category.id)}
						>
							{category.categoryName}
						</Button>
					</Col>
				))}
			</Row>

			{/* Vote button */}
			<div
				style={{
					padding: "20px",
					display: "flex",
					justifyContent: "center",
					marginTop: "20px",
				}}
			>
				{!isVotingEnabled && (
					<Alert
						message={<b>Bình chọn đang được tắt!</b>}
						description="Ấn nút 'Mở Bình Chọn' để bắt đầu bình chọn"
						type="info"
						showIcon
					/>
				)}
				{!selectedId && isVotingEnabled && (
					<Alert
						message={<b>Chọn một tiết mục để bình chọn</b>}
						description="Chọn một trong những tiết mục ở trên để bắt đầu bình chọn"
						type="info"
						showIcon
					/>
				)}
				{selectedId && isVotingEnabled && (
					<Button
						className={styles.buttonCustom}
						type="primary"
						onClick={handleVote}
						size="large"
					>
						{!isVotingEnabled ? "Voting is currently disabled" : "Vote"}
					</Button>
				)}
			</div>
		</div>
	);
};

export default HomePage;
