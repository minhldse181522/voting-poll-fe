import { Button, Col, Input, Row, Spin, Steps } from "antd";
import { useCallback, useEffect, useState } from "react";
import stylesHome from "../pages/styles/Homepage.module.scss";
import styles from "../pages/styles/ConfigPage.module.scss";
import { Category } from "../types/Category";
import {
	addCategory,
	addPerformance,
	getCategories,
	getPerformanceByCategory,
} from "../services/userService";
import { setPerformances } from "../store/slices/performanceSlice";
import { useDispatch, useSelector } from "react-redux";
import PerformanceCard from "../components/PerformanceCard";
import CategoryCard from "../components/CategoryCard";

const ConfigPage = () => {
	const dispatch = useDispatch();
	const performances = useSelector(
		(state: any) => state.performance.performances,
	);
	const [currentStep, setCurrentStep] = useState(0);
	const [isRead, setIsRead] = useState(true);
	const [isAdd, setIsAdd] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [formValue, setFormValue] = useState<any>({
		categoryName: "",
		categoryDescription: "",
		performanceName: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const fetchAddCategory = useCallback(async () => {
		try {
			await addCategory({
				categoryName: formValue.categoryName,
				description: formValue.categoryDescription,
			});
		} catch (error) {
			console.log("Error adding categories", error);
		}
	}, [formValue]);

	const fetchAddPerformance = useCallback(async () => {
		try {
			await addPerformance({
				name: formValue.performanceName,
			});
		} catch (error) {
			console.log("Error adding categories", error);
		}
	}, [formValue]);

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

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	useEffect(() => {
		fetchPerformances();
	}, [fetchPerformances]);

	return (
		<Spin tip="Loading..." spinning={isLoading}>
			<div
				style={{
					height: "100vh",
					overflow: "hidden",
				}}
			>
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
						<div style={{ width: "100%", padding: "0 15%" }}>
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
					<div style={{ width: "95%", padding: "0 5%" }}>
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
								<div>
									<div style={{ fontWeight: 400 }}>Hạng mục 1</div>
									<Input
										placeholder="Nhập tên hạng mục"
										onChange={(event) =>
											setFormValue((prev: any) => ({
												...prev,
												["categoryName"]: event.currentTarget.value,
											}))
										}
										value={formValue.categoryName}
										style={{
											width: "100%",
											display: "block",
											margin: "20px 0",
										}}
									/>
									<Input
										placeholder="Nhập mô tả hạng mục"
										onChange={(event) =>
											setFormValue((prev: any) => ({
												...prev,
												["categoryDescription"]: event.currentTarget.value,
											}))
										}
										value={formValue.categoryDescription}
										style={{ width: "100%", display: "block" }}
									/>
								</div>
								<div>
									<div style={{ fontWeight: 400 }}>Hạng mục 2</div>
									<Input
										placeholder="Nhập tên hạng mục"
										onChange={(event) =>
											setFormValue((prev: any) => ({
												...prev,
												["categoryName"]: event.currentTarget.value,
											}))
										}
										value={formValue.categoryName}
										style={{
											width: "100%",
											display: "block",
											margin: "20px 0",
										}}
									/>
									<Input
										placeholder="Nhập mô tả hạng mục"
										onChange={(event) =>
											setFormValue((prev: any) => ({
												...prev,
												["categoryDescription"]: event.currentTarget.value,
											}))
										}
										value={formValue.categoryDescription}
										style={{ width: "100%", display: "block" }}
									/>
								</div>
								<div>
									<div style={{ fontWeight: 400 }}>Hạng mục 3</div>
									<Input
										placeholder="Nhập tên hạng mục"
										onChange={(event) =>
											setFormValue((prev: any) => ({
												...prev,
												["categoryName"]: event.currentTarget.value,
											}))
										}
										value={formValue.categoryName}
										style={{
											width: "100%",
											display: "block",
											margin: "20px 0",
										}}
									/>
									<Input
										placeholder="Nhập mô tả hạng mục"
										onChange={(event) =>
											setFormValue((prev: any) => ({
												...prev,
												["categoryDescription"]: event.currentTarget.value,
											}))
										}
										value={formValue.categoryDescription}
										style={{ width: "100%", display: "block" }}
									/>
								</div>
							</div>
						)}
						{currentStep == 1 && (
							<>
								<Input
									placeholder="Nhập tên tiết mục"
									onChange={(event) =>
										setFormValue((prev: any) => ({
											...prev,
											["performanceName"]: event.currentTarget.value,
										}))
									}
									value={formValue.performanceName}
									style={{ width: "30%", display: "block", margin: "20px 0" }}
								/>
							</>
						)}
						{currentStep == 2 && (
							<>
								<div>Hình nền hiện tại</div>
							</>
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
									onClick={() => {
										if (
											formValue.categoryName &&
											formValue.categoryDescription
										) {
											fetchAddCategory();
										}
										if (formValue.performanceName) {
											fetchAddPerformance();
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
