import { Button, Card, Input } from "antd";
import { Performance } from "../types/Performance";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { deletePerformance, updatePerformance } from "../services/userService";

const PerformanceCard = ({
  performance,
  setIsLoading,
}: {
  performance: Performance;
  setIsLoading: any;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Performance>();

  const fetchDeletePerformance = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await deletePerformance(id);
    } catch (error) {
      console.log("Error adding categories", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUpdatePerformance = useCallback(
    async (performance: Performance) => {
      try {
        setIsLoading(true);
        await updatePerformance(performance.id, {
          name: performance.name,
        });
      } catch (error) {
        console.log("Error update performance", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <Card
      key={performance.id}
      hoverable
      style={{
        width: 400,
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        marginBottom: "3%",
      }}
    >
      <div
        style={{
          padding: "5px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Title level={4} style={{ marginBottom: "8px" }}>
            {isEdit ? (
              <Input
                value={currentEdit?.name}
                onChange={(e) =>
                  setCurrentEdit((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                onPressEnter={() => {
                  fetchUpdatePerformance(currentEdit as Performance);
                  setIsEdit(false);
                }}
              />
            ) : (
              performance.name
            )}
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
            onClick={() => {
              setIsEdit((prev) => !prev);
              setCurrentEdit(performance);
            }}
          />
          <Button
            type="primary"
            style={{
              marginTop: "12px",
              backgroundColor: "#df454a",
            }}
            icon={<DeleteOutlined />}
            onClick={() => fetchDeletePerformance(performance.id)}
          />
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCard;
