import {
	Button,
	Col,
	ColorPicker,
	Image,
	Row,
	Spin,
	Steps,
	Upload,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import stylesHome from "../pages/styles/Homepage.module.scss";
import styles from "../pages/styles/ConfigPage.module.scss";
import { AddCategory, Category } from "../types/Category";
import {
	addCategory,
	addPerformance,
	addSettings,
	getCategories,
	getPerformanceByCategory,
	getSettings,
} from "../services/userService";
import { setPerformances } from "../store/slices/performanceSlice";
import { useDispatch, useSelector } from "react-redux";
import PerformanceCard from "../components/PerformanceCard";
import CategoryCard from "../components/CategoryCard";
import PerformanceInputList from "../components/PerformanceInputList";
import { AddPerformance } from "../types/Performance";
import CategoryInput from "../components/CategoryInput";
import { useNavigate } from "react-router";
import Title from "antd/es/typography/Title";
import { Settings } from "../types/Settings";
import { uploadImage } from "../config/cloudinary";
import { toast } from "react-toastify";

export interface FormType {
	categoryList: AddCategory[];
	performanceList: AddPerformance[];
}

const ConfigPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const performances = useSelector(
		(state: any) => state.performance.performances,
	);
	const [currentStep, setCurrentStep] = useState(0);
	const [isRead, setIsRead] = useState(true);
	const [isAdd, setIsAdd] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [formValue, setFormValue] = useState<FormType>({
		categoryList: [],
		performanceList: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [performanceList, setPerformanceList] = useState<string[]>([""]);
	const [settingsData, setSettingsData] = useState<Settings>();

	const fetchAddCategoryList = useCallback(async () => {
		try {
			formValue.categoryList && (await addCategory(formValue.categoryList));
		} catch (error) {
			console.log("Error adding categories", error);
		}
	}, [formValue]);

	const fetchAddPerformanceList = useCallback(async () => {
		try {
			formValue.performanceList &&
				(await addPerformance(formValue.performanceList));
		} catch (error) {
			console.log("Error adding performances", error);
		}
	}, [formValue]);

	const fetchSettings = useCallback(async () => {
		try {
			const res = await getSettings();
			const data = res.data.data;
			setSettingsData({
				bgDesktop: data[data.length - 1].bgDesktop,
				bgPhone: data[data.length - 1].bgPhone,
				textColor: data[data.length - 1].textColor,
				buttonColor: data[data.length - 1].buttonColor,
			});
		} catch (error) {
			console.log("Error adding performances", error);
		}
	}, []);

	const fetchCategories = useCallback(async () => {
		try {
			const res = await getCategories();
			const data = res.data.data;
			setCategories(data);
		} catch (error) {
			console.log("Error fetching categories", error);
		}
	}, []);

	const fetchPerformances = useCallback(async () => {
		if (categoryId === null) return;
		try {
			setIsLoading(true);
			const res = await getPerformanceByCategory(categoryId);
			const data = res.data.data;
			dispatch(setPerformances(data));
		} catch (error) {
			console.error("Error fetching performances:", error);
		} finally {
			setIsLoading(false);
		}
	}, [categoryId, dispatch]);

	const handleUpload = async (
		file: File,
		imgField: "bgDesktop" | "bgPhone",
	) => {
		try {
			setIsLoading(true);
			const result = await uploadImage(file);
			setSettingsData((prev) => ({
				bgPhone:
					imgField === "bgPhone" ? result.secure_url : (prev?.bgPhone ?? ""),
				bgDesktop:
					imgField === "bgDesktop"
						? result.secure_url
						: (prev?.bgDesktop ?? ""),
				textColor: prev?.textColor ?? "",
				buttonColor: prev?.buttonColor ?? "",
			}));

			toast.success(
				`Upload hình nền ${imgField === "bgPhone" ? "điện thoại" : "máy tính"} thành công!`,
			);
		} catch (error) {
			console.error("Error uploading image", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchAddSettings = useCallback(async () => {
		try {
			setIsLoading(true);
			await addSettings(settingsData!);
		} catch (error) {
			console.error("Error adding settings", error);
		} finally {
			setIsLoading(false);
		}
	}, [settingsData]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	useEffect(() => {
		fetchPerformances();
	}, [fetchPerformances]);

	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);

	return (
		<Spin tip="Loading..." spinning={isLoading}>
			<div>
				<Button
					className={stylesHome.buttonCustom}
					style={{ marginLeft: "1%" }}
					onClick={() => navigate("/")}
				>
					Trở lại
				</Button>
				{/* nav bar */}
				<Row
					gutter={[16, 16]}
					style={{ marginTop: 5, justifyContent: "center" }}
				>
					<Col>
						<Button
							className={stylesHome.buttonCustom}
							type={isRead ? "primary" : "default"}
							style={{
								color: isRead ? "#fff" : "#000",
								backgroundColor: isRead ? "#1890ff" : "#d9d9d9",
							}}
							onClick={() => {
								setIsRead((prev) => !prev);
								setIsAdd((prev) => !prev);
							}}
						>
							Thông tin
						</Button>
					</Col>
					<Col>
						<Button
							className={stylesHome.buttonCustom}
							type={isAdd ? "primary" : "default"}
							style={{
								color: isAdd ? "#fff" : "#000",
								backgroundColor: isAdd ? "#1890ff" : "#d9d9d9",
							}}
							onClick={() => {
								setIsRead((prev) => !prev);
								setIsAdd((prev) => !prev);
							}}
						>
							Thêm mới
						</Button>
					</Col>
				</Row>

				{/* categories & performance list */}
				{isRead && (
					<>
						<div style={{ width: "100%", padding: "0 15%", marginTop: "5%" }}>
							{/* categories list */}
							<div style={{ fontWeight: 600 }}>Hạng mục</div>
							<div className={styles["category-container"]}>
								{categories.map((category) => (
									<CategoryCard
										category={category}
										setCategoryId={setCategoryId}
										categoryId={categoryId}
										setIsLoading={setIsLoading}
									/>
								))}
							</div>

							{/* performance list */}
							{performances && categories.length && categoryId && (
								<div style={{ fontWeight: 600, margin: "3% 0" }}>Tiết mục</div>
							)}
							<div style={{ width: "100%", height: "200px", overflow: "auto" }}>
								{performances && categories.length && categoryId && (
									<>
										{performances.map((performance: any) => (
											<PerformanceCard
												performance={performance}
												setIsLoading={setIsLoading}
											/>
										))}
									</>
								)}
							</div>
						</div>

						{/* save button */}
						<div
							style={{
								padding: "20px",
								display: "flex",
								justifyContent: "center",
								gap: "20px",
								position: "fixed",
								bottom: 0,
								left: 0,
								right: 0,
								backgroundColor: "white",
								zIndex: 1000,
							}}
						>
							<Button className={stylesHome.buttonCustom}>Lưu</Button>
						</div>
					</>
				)}

				{isAdd && (
					<div style={{ width: "95%", padding: "0 5%", marginBottom: "10%" }}>
						<Steps
							style={{ marginTop: 50 }}
							current={currentStep}
							items={[
								{
									title: "Thêm hạng mục",
									description: "Thêm hạng mục",
								},
								{
									title: "Thêm tiết mục",
									description: "Thêm tiết mục",
								},
								{
									title: "Thêm nền",
									description: "Thêm nền",
								},
							]}
						/>

						{currentStep == 0 && (
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginTop: 80,
								}}
							>
								<CategoryInput
									index={0}
									formValue={formValue}
									setFormValue={setFormValue}
								/>
								<CategoryInput
									index={1}
									formValue={formValue}
									setFormValue={setFormValue}
								/>
								<CategoryInput
									index={2}
									formValue={formValue}
									setFormValue={setFormValue}
								/>
							</div>
						)}
						{currentStep == 1 && (
							<div style={{ width: "100%", marginTop: "10%" }}>
								<PerformanceInputList
									performanceList={performanceList}
									formValue={formValue}
									setFormValue={setFormValue}
								/>
								<Button
									className={stylesHome.buttonCustom}
									onClick={() => setPerformanceList((prev) => [...prev, ""])}
								>
									+ Thêm tiết mục
								</Button>
							</div>
						)}
						{currentStep == 2 && (
							<div style={{ display: "flex", gap: "10%", marginTop: "3%" }}>
								<div>
									<Title level={5} style={{ marginTop: "2%" }}>
										Hình nền điện thoại
									</Title>
									{!settingsData?.bgPhone ? (
										<>
											<p>chưa có</p>
											<Upload
												className={stylesHome.buttonCustom}
												customRequest={({ file }) =>
													handleUpload(file as File, "bgPhone")
												}
											>
												+ Thêm mới
											</Upload>
										</>
									) : (
										<>
											<Image width={200} src={settingsData.bgPhone} />
											<div>
												<Upload
													className={stylesHome.buttonCustom}
													customRequest={({ file }) =>
														handleUpload(file as File, "bgPhone")
													}
												>
													Đổi ảnh
												</Upload>
											</div>
										</>
									)}
								</div>
								<div>
									<Title level={5} style={{ marginTop: "2%" }}>
										Hình nền máy tính
									</Title>
									{!settingsData?.bgDesktop ? (
										<>
											<p>chưa có</p>
											<Upload
												className={stylesHome.buttonCustom}
												customRequest={({ file }) =>
													handleUpload(file as File, "bgDesktop")
												}
											>
												+ Thêm mới
											</Upload>
										</>
									) : (
										<>
											<Image width={200} src={settingsData.bgDesktop} />
											<div>
												<Upload
													className={stylesHome.buttonCustom}
													customRequest={({ file }) =>
														handleUpload(file as File, "bgDesktop")
													}
													style={{ marginLeft: "1%", display: "block" }}
												>
													Đổi ảnh
												</Upload>
											</div>
										</>
									)}
								</div>
								{/* text color input */}
								<div>
									<Title level={5} style={{ marginTop: "2%" }}>
										Màu chữ
									</Title>
									<ColorPicker
										value={settingsData?.textColor}
										showText
										size="large"
										onChange={(value) =>
											setSettingsData((prev) => ({
												bgPhone: prev?.bgPhone ?? "",
												bgDesktop: prev?.bgDesktop ?? "",
												textColor: value.toHexString(),
												buttonColor: prev?.buttonColor ?? "",
											}))
										}
									/>
								</div>
								{/* text color input */}
								<div>
									<Title level={5} style={{ marginTop: "2%" }}>
										Màu nút bấm
									</Title>
									<ColorPicker
										value={settingsData?.buttonColor}
										showText
										size="large"
										onChange={(value) =>
											setSettingsData((prev) => ({
												bgPhone: prev?.bgPhone ?? "",
												bgDesktop: prev?.bgDesktop ?? "",
												textColor: prev?.textColor ?? "",
												buttonColor: value.toHexString(),
											}))
										}
									/>
								</div>
							</div>
						)}

						{/* save button */}
						<div
							style={{
								padding: "20px",
								display: "flex",
								justifyContent: "center",
								gap: "20px",
								position: "fixed",
								bottom: 0,
								left: 0,
								right: 0,
								backgroundColor: "white",
								zIndex: 1000,
							}}
						>
							{currentStep < 2 && (
								<Button
									className={stylesHome.buttonCustom}
									onClick={() => setCurrentStep((prev) => prev + 1)}
								>
									Tiếp theo
								</Button>
							)}

							{currentStep == 2 && (
								<Button
									className={stylesHome.buttonCustom}
									disabled={isLoading}
									onClick={() => {
										try {
											fetchAddCategoryList();
											fetchAddPerformanceList();
											fetchAddSettings();
											toast.success("Lưu thông tin thành công!");
										} catch (error) {
											console.log("Error while trying to save data");
										}
									}}
								>
									Lưu
								</Button>
							)}

							{currentStep > 0 && (
								<Button
									className={stylesHome.buttonCustom}
									onClick={() => {
										if (currentStep <= 2) {
											setCurrentStep((prev) => prev - 1);
										}
									}}
								>
									Quay lại
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</Spin>
	);
};

export default ConfigPage;
