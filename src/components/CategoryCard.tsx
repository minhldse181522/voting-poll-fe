import { Button, Card, Input } from "antd";
import { Category } from "../types/Category";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteCategory, updateCategory } from "../services/userService";
import { useCallback, useState } from "react";

const CategoryCard = ({
  category,
  setCategoryId,
  categoryId,
  setIsLoading,
}: {
  category: Category;
  setIsLoading: any;
  setCategoryId: any;
  categoryId: any;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Category>();

  const fetchDeleteCategory = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await deleteCategory(id);
    } catch (error) {
      console.log("Error adding categories", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUpdateCategory = useCallback(async (category: Category) => {
    try {
      setIsLoading(true);
      await updateCategory(category.id, {
        categoryName: category.categoryName,
        description: category.description,
      });
    } catch (error) {
      console.log("Error update categories", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Card
      key={category.id}
      hoverable
      onClick={() => setCategoryId(Number(category.id))}
      style={{
        width: 300,
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        border: `${
          categoryId == Number(category.id) ? "solid #1890ff 2px" : ""
        }`,
      }}
    >
      <div style={{ padding: "16px" }}>
        <Title level={4} style={{ marginBottom: "8px" }}>
          {isEdit ? (
            <Input
              value={currentEdit?.categoryName}
              onChange={(e) =>
                setCurrentEdit((prev) =>
                  prev ? { ...prev, categoryName: e.target.value } : prev
                )
              }
              onPressEnter={() => {
                fetchUpdateCategory(currentEdit as Category);
                setIsEdit(false);
              }}
            />
          ) : (
            category.categoryName
          )}
        </Title>
        <Paragraph style={{ color: "#555" }}>
          {isEdit ? (
            <Input
              value={currentEdit?.description || ""}
              onChange={(e) =>
                setCurrentEdit((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev
                )
              }
              onPressEnter={() => {
                fetchUpdateCategory(currentEdit as Category);
                setIsEdit(false);
              }}
            />
          ) : (
            category.description
          )}
        </Paragraph>
        <Button
          type="primary"
          style={{ marginTop: "12px", marginRight: "8px" }}
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentEdit(category);
            setIsEdit((prev) => !prev);
          }}
        />
        <Button
          type="primary"
          style={{
            marginTop: "12px",
            backgroundColor: "#df454a",
          }}
          icon={<DeleteOutlined />}
          onClick={() => fetchDeleteCategory(category.id)}
        />
      </div>
    </Card>
  );
};

export default CategoryCard;
