import { Button, Col, Row, Spin, Steps } from "antd";
import { useCallback, useEffect, useState } from "react";
import stylesHome from "../pages/styles/Homepage.module.scss";
import styles from "../pages/styles/ConfigPage.module.scss";
import { AddCategory, Category } from "../types/Category";
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
import PerformanceInputList from "../components/PerformanceInputList";
import { AddPerformance } from "../types/Performance";
import CategoryInput from "../components/CategoryInput";

export interface FormType {
	categoryList: AddCategory[];
	performanceList: AddPerformance[];
}

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
	const [formValue, setFormValue] = useState<FormType>({
		categoryList: [],
		performanceList: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [performanceList, setPerformanceList] = useState<string[]>([""]);

	const fetchAddCategoryList = useCallback(async () => {
		try {
			console.log(formValue.categoryList);
			await addCategory(formValue.categoryList);
		} catch (error) {
			console.log("Error adding categories", error);
		}
	}, [formValue]);

	const fetchAddPerformanceList = useCallback(async () => {
		try {
			console.log(formValue.performanceList);
			await addPerformance(formValue.performanceList);
		} catch (error) {
			console.log("Error adding performances", error);
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
									onClick={() => setPerformanceList((prev) => [...prev, ""])}
								>
									+ Thêm tiết mục
								</Button>
							</div>
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
										fetchAddCategoryList();
										fetchAddPerformanceList();
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
