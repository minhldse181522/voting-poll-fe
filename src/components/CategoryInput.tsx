import { Input } from "antd";
import { Dispatch, SetStateAction } from "react";
import { FormType } from "../pages/ConfigPage";

const CategoryInput = ({
  index,
  setFormValue,
  formValue,
}: {
  index: number;
  setFormValue: Dispatch<SetStateAction<FormType>>;
  formValue: FormType;
}) => {
  return (
    <div>
      <div style={{ fontWeight: 400 }}>Hạng mục {index + 1}</div>
      <Input
        placeholder="Nhập tên hạng mục"
        onChange={(event) =>
          setFormValue((prev) => {
            const newList = [...prev.categoryList];
            newList[index] = {
              ...newList[index],
              categoryName: event.target.value,
            };
            return {
              ...prev,
              categoryList: newList,
            };
          })
        }
        value={formValue.categoryList[index]?.categoryName || ""}
        style={{
          width: "100%",
          display: "block",
          margin: "20px 0",
        }}
      />
      <Input
        placeholder="Nhập mô tả hạng mục"
        onChange={(event) =>
          setFormValue((prev) => {
            const newList = [...prev.categoryList];
            newList[index] = {
              ...newList[index],
              description: event.target.value,
            };
            return {
              ...prev,
              categoryList: newList,
            };
          })
        }
        value={formValue.categoryList[index]?.description || ""}
        style={{ width: "100%", display: "block" }}
      />
    </div>
  );
};

export default CategoryInput;
