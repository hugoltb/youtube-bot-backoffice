import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Row, Col, Form, Input } from "antd";
import SystemService from "services/SystemService";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import { STORAGE } from "utils/utils";
import mainLogo from "assets/icon/yt-bot-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Header, Footer, Content } = Layout;

  const clickLogin = (values) => {
          // STORAGE.SET("username", "admin");
          // STORAGE.SET("role", "admin");
          // STORAGE.SET("expired", 999999999999999999999);
          // STORAGE.SET("token", "asdasdasda");
          // navigate("/dashboard");
          let reqData = {
      email: values.username,
      password: values.password,
    };
    SystemService.userLogin(reqData)
      .then(({ data }) => {
        if (data.token) {
          let access_token = data.token;
          let payload = jwtDecode(access_token);
          STORAGE.SET("username", payload.email);
          STORAGE.SET("expired", payload.exp);
          STORAGE.SET("token", access_token);
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        let errMessage = err?.response?.data?.message;
        Swal.fire({
          title: "ผิดพลาด!",
          text: errMessage ? errMessage : "Something went wrong !",
          icon: "error",
        });
      });
  };

  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#7dbcea11",
    height:"80px"
  };

  return (
    <Layout className="bg-login">
      <Header className="header-style">
        <Row className="h-100">
          <Col className="h-100 d-none-380px" flex="220px">
            <Button
              type="link"
              style={{ height: "60px", verticalAlign: "middle" }}
            >
              <img
                src={mainLogo}
                style={{ width: "100%" }}
              />
            </Button>
          </Col>
          <Col className="h-100" flex="auto" style={{ textAlign: "right" }}>
            {process.env.NODE_ENV === "development" && (
              <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                {process.env.NODE_ENV}
              </span>
            )}
          </Col>
        </Row>
      </Header>
      <Content className="container2 body-style">
        <Row
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col
            style={{
              height: "600px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
            span={24}
          >
            <div>
              <div className="form-box">
                <Form
                  form={form}
                  onFinish={clickLogin}
                  style={{ width: "100%" }}
                >
                  <h1
                    style={{
                      textAlign: "left",
                      marginBottom: "0.5rem",
                      color: "white",
                    }}
                  >
                    Youtube Bots
                  </h1>
                  <span style={{ color: "#ffffffa8" }}>
                    Enter your username and password for login.
                  </span>
                  <div style={{ marginTop: "50px" }}>
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your email!",
                        },
                      ]}
                    >
                      <Input placeholder="Email" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className="primary-button"
                        style={{ width: "100%" }}
                        htmlType="submit"
                      >
                        Sign in
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={footerStyle}>
        <Row className="h-100">
          <Col className="h-100" flex="220px"></Col>
          <Col className="h-100" flex="auto" style={{ textAlign: "right" }}>

          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};
export default Login;
