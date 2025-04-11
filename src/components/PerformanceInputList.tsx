import { Input } from "antd";
import Title from "antd/es/typography/Title";
import { FormType } from "../pages/ConfigPage";
import { Dispatch, SetStateAction } from "react";

const PerformanceInputList = ({
  performanceList,
  formValue,
  setFormValue,
}: {
  performanceList: string[];
  setFormValue: Dispatch<SetStateAction<FormType>>;
  formValue: FormType;
}) => {
  return (
    <>
      {performanceList.map((_, index) => (
        <div key={index} style={{ width: "100%", textAlign: "center" }}>
          <Title level={5}>Tiết mục {index}</Title>
          <Input
            placeholder="Nhập tên tiết mục"
            onChange={(event) =>
              setFormValue((prev) => {
                const newList = [...prev.performanceList];
                newList[index] = { name: event.target.value };
                return {
                  ...prev,
                  performanceList: newList,
                };
              })
            }
            value={formValue.performanceList[index]?.name || ""}
            style={{
              width: "30%",
              display: "block",
              margin: "0 auto",
              marginBottom: "5%",
            }}
          />
        </div>
      ))}
    </>
  );
};

export default PerformanceInputList;
