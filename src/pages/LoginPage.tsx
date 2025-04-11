import { Button, Col, Form, Input, Row } from "antd";
import { FormProps } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import VoteImage from "../assets/fac86d224437ecab6996384f11627a07.jpg";
import { loginUser } from "../services/authService";
import { login } from "../store/slices/userSlice";
import styles from "./styles/Login.module.scss";

type FieldType = {
  username: string;
  password: string;
};

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const username = values.username;
    const password = values.password;
    const payload = {
      username,
      password,
    };
    try {
      const res = await loginUser(payload);
      const data = res.data.data;
      if (data) {
        dispatch(login(data));
        navigate("/config");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Welcome Back</h2>
        <div>Sign in by your business account and manage your projects</div>
        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]} style={{ justifyContent: "center" }}>
            <Col className="gutter-row" span={24}>
              <Form.Item<FieldType>
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
                style={{ marginBottom: -100, width: 300 }}
              >
                <Input placeholder="Enter your business account" />
              </Form.Item>
              <Form.Item<FieldType>
                name="password"
                style={{ marginBottom: -100 }}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input placeholder="Enter your password" />
              </Form.Item>
              <Button
                className={styles.buttonCustom}
                type="primary"
                htmlType="submit"
                size="large"
              >
                Login
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className={styles.imageContainer}>
        <img src={VoteImage} alt="Voting" className={styles.imageContent} />
      </div>
    </div>
  );
}

export default LoginPage;
