import { Button, Col, Row } from "antd";
import { useState } from "react";
import stylesHome from "../pages/styles/Homepage.module.scss";
import stylesConfig from "../pages/styles/Config.module.scss";

const ConfigPage = () => {
  const [isRead, setIsRead] = useState(true);
  const [isAdd, setIsAdd] = useState(false);
  return (
    <div>
      {/* nav bar */}
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 40, justifyContent: "center" }}
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
      <div>
        {/* categories list */}
        <div></div>

        {/* performance list */}
        <div></div>
      </div>

      {/* save button */}
      <Button className={stylesHome.buttonCustom}>Lưu</Button>
    </div>
  );
};

export default ConfigPage;
