import { Button, Card, Col, Input, Row, Spin, Steps } from "antd";
import { useCallback, useEffect, useState } from "react";
import stylesHome from "../pages/styles/Homepage.module.scss";
import styles from "../pages/styles/ConfigPage.module.scss";
import { Category } from "../types/Category";
import { addCategory, addPerformance, deleteCategory, deletePerformance, getCategories, getPerformanceByCategory } from "../services/userService";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { setPerformances } from "../store/slices/performanceSlice";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ConfigPage = () => {
  const dispatch = useDispatch();
  const performances = useSelector(
    (state: any) => state.performance.performances
  );
  const [currentStep, setCurrentStep] = useState(0)
  const [isRead, setIsRead] = useState(true);
  const [isAdd, setIsAdd] = useState(false);
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<any>({
    categoryName: "",
    categoryDescription: "",
    performanceName: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchAddCategory = useCallback(async () => {
    try {
      await addCategory({
        categoryName: formValue.categoryName,
        description: formValue.categoryDescription
      });
    } catch (error) {
      console.log("Error adding categories", error);
    }
  }, [formValue])

  const fetchAddPerformance = useCallback(async () => {
    try {
      await addPerformance({
        name: formValue.performanceName,
      });
    } catch (error) {
      console.log("Error adding categories", error);
    }
  }, [formValue])

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
      setIsLoading(true)
      const res = await getPerformanceByCategory(categoryId);
      const data = res.data.data;
      dispatch(setPerformances(data));
    } catch (error) {
      console.error("Error fetching performances:", error);
    } finally {
      setIsLoading(false)
    }
  }, [categoryId, dispatch]);

  const fetchDeletePerformance = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      await deletePerformance(id)
    } catch (error) {
      console.log("Error adding categories", error);
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchDeleteCategory = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      await deleteCategory(id)
    } catch (error) {
      console.log("Error adding categories", error);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPerformances();
  }, [fetchPerformances])

  return (
    <Spin tip="Loading..." spinning={isLoading}>
      <div>
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
        {isRead && (<>
          <div style={{ width: "100%", padding: "0 15%" }}>
            {/* categories list */}
            <div style={{ fontWeight: 600 }}>Hạng mục</div>
            <div className={styles["category-container"]}>
              {categories.map((category) => (
                <Card
                  key={category.id}
                  hoverable
                  onClick={() => setCategoryId(Number(category.id))}
                  style={{
                    width: 300,
                    borderRadius: 12,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    border: `${categoryId == Number(category.id) ? "solid #1890ff 2px" : ""}`
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <Title level={4} style={{ marginBottom: "8px" }}>
                      {category.categoryName}
                    </Title>
                    <Paragraph style={{ color: "#555" }}>
                      {category.description}
                    </Paragraph>
                    <Button
                      type="primary"
                      style={{ marginTop: "12px", marginRight: "8px" }}
                      icon={<EditOutlined />}
                    />
                    <Button
                      type="primary"
                      style={{ marginTop: "12px", backgroundColor: "#df454a" }}
                      icon={<DeleteOutlined />}
                      onClick={() => fetchDeleteCategory(category.id)}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* performance list */}
            {(performances && categories.length && categoryId) && <div style={{ fontWeight: 600, margin: "3% 0" }}>Tiết mục</div>}
            <div style={{ width: "100%", height: "200px", overflow: "auto" }} >
              {(performances && categories.length && categoryId) && (
                <>
                  {
                    performances.map((performance: any) => (
                      <Card
                        key={performance.id}
                        hoverable
                        style={{
                          width: 400,
                          borderRadius: 12,
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          marginBottom: "3%"
                        }}
                      >
                        <div style={{ padding: "5px", display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <Title level={4} style={{ marginBottom: "8px" }}>
                              {performance.name}
                            </Title>
                            <Paragraph style={{ color: "#555" }}>
                              vote: {performance.vote}
                            </Paragraph>
                          </div>
                          <div>
                            <Button
                              type="primary"
                              style={{ marginTop: "12px", marginRight: "8px" }}
                              icon={<EditOutlined />}
                            />
                            <Button
                              type="primary"
                              style={{ marginTop: "12px", backgroundColor: "#df454a" }}
                              icon={<DeleteOutlined />}
                              onClick={() => fetchDeletePerformance(performance.id)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))
                  }
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
              marginTop: "20px",
            }}
          >
            <Button className={stylesHome.buttonCustom}>Lưu</Button>
          </div>
        </>)}

        {isAdd && (<div style={{ width: "95%", padding: "0 5%" }}>
          <Steps
            style={{ marginTop: 50 }}
            current={currentStep}
            items={[
              {
                title: 'Thêm hạng mục',
                description: 'Thêm hạng mục',
              },
              {
                title: 'Thêm tiết mục',
                description: 'Thêm tiết mục'
              },
              {
                title: 'Thêm nền',
                description: 'Thêm nền'
              },
            ]}
          />

          {currentStep == 0 &&
            <>
              <Input placeholder="Nhập tên hạng mục" onChange={
                (event) => setFormValue((prev: any) => (
                  { ...prev, ["categoryName"]: event.currentTarget.value })
                )}
                value={formValue.categoryName}
                style={{ width: "30%", display: "block", margin: "20px 0" }} />
              <Input placeholder="Nhập mô tả hạng mục"
                onChange={
                  (event) => setFormValue((prev: any) => (
                    { ...prev, ["categoryDescription"]: event.currentTarget.value })
                  )}
                value={formValue.categoryDescription}
                style={{ width: "30%", display: "block" }} />
            </>
          }
          {currentStep == 1 &&
            <>
              <Input placeholder="Nhập tên tiết mục"
                onChange={
                  (event) => setFormValue((prev: any) => (
                    { ...prev, ["performanceName"]: event.currentTarget.value })
                  )}
                value={formValue.performanceName}
                style={{ width: "30%", display: "block", margin: "20px 0" }} />
            </>
          }
          {currentStep == 2 &&
            <>
              <div>
                Hình nền hiện tại
              </div>
            </>
          }

          {/* save button */}
          <div
            style={{
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {currentStep < 2 &&
              <Button className={stylesHome.buttonCustom}
                onClick={() =>
                  setCurrentStep((prev) => prev + 1)
                }
              >Tiếp theo</Button>
            }

            {currentStep == 2 &&
              <Button className={stylesHome.buttonCustom}
                onClick={() => {
                  if (formValue.categoryName && formValue.categoryDescription) {
                    fetchAddCategory()
                  }
                  if (formValue.performanceName) {
                    fetchAddPerformance();
                  }
                }}
              >Lưu</Button>
            }

            {currentStep > 0 &&
              <Button className={stylesHome.buttonCustom}
                onClick={() => {
                  if (currentStep <= 2) {
                    setCurrentStep((prev) => prev - 1)
                  }
                }}
              >Quay lại</Button>
            }
          </div>
        </div>)}
      </div >
    </Spin>
  );
};

export default ConfigPage;
