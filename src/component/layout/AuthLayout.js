import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import NavHeader from "../NavHeader";
import { Layout } from "antd";
import { STORAGE } from "utils/utils";

const { Footer, Content } = Layout;

const AuthLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let exp = STORAGE.GET("expired");
    let token = STORAGE.GET("token");
    let current = parseInt(Date.now() / 1000);

    if (!token || !exp || current > exp) {
      STORAGE.CLEAR();
      navigate("/login", { replace: true });
    }
  }, [location.pathname]);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <NavHeader setCollapsed={setCollapsed} collapsed={collapsed} />
        <Content className="container">
          <Outlet />
        </Content>
        <Footer className="footer">Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};
export default AuthLayout;
