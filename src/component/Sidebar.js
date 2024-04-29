import React, { useState, useEffect } from "react";
import { Menu, Layout } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import profileImage from "assets/image/avatar-1.png";
import { nav } from "../nav";
import { STORAGE } from "utils/utils";
import mainLogo from "assets/icon/yt-bot-logo.png";
import miniLogo from "assets/icon/bot.png";

const { Sider } = Layout;

const NavBar = ({ collapsed }) => {
  const usRole = STORAGE.GET("role");
  const usName = STORAGE.GET("username");
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="navbar-container">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="sm"
        collapsedWidth={screenWidth < 500 ? 0 : 80}
      >
        <h1
          style={{
            textAlign: "center",
            margin: "0",
            padding: "10px 10px",
            backgroundColor: "white",
            fontSize: "22px",
            color: "#2d313d",
            // width: !collapsed ? "220px" : null,
          }}
        >
          {!collapsed ? (
            <img src={mainLogo} width="100%" height="auto" />
          ) : (
            <img src={miniLogo} width="80%" height="auto" />
          )}
        </h1>
        <Menu className="navbar-custom">
          <div
            style={{
              minHeight: "120px",
              padding: "20px 40px",
              marginBottom: "10px",
              // backgroundColor: "#f9f9f9",
              display: !collapsed ? "block" : "none",
            }}
          >
            <img
              src={profileImage}
              width="100%"
              height="auto"
              style={{ borderRadius: "12px", border: "1px solid #393e4c" }}
            />

            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <span
                style={{
                  color: "#3a3f4e",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {usName ? usName : "Demo Account"}
              </span>
            </div>
            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <span
                style={{
                  color: "#1677ff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {/* {usRole ? usRole : "system admin"} */}
              </span>
            </div>
          </div>

          {collapsed && (
            <div style={{ padding: "12px" }}>
              <img
                src={profileImage}
                width="100%"
                height="auto"
                style={{ borderRadius: "12px", border: "1px solid #393e4c" }}
              />
            </div>
          )}

          {nav.map((item) => {
            if (item.label === "Logout") {
              return (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={() => STORAGE.CLEAR()}
                >
                  <NavLink to={item.path}>{item.label}</NavLink>
                </Menu.Item>
              );
            } else if (item.type === "sub") {
              return (
                <>
                  {collapsed ? (
                    <div style={{ margin: "1.25rem 0rem" }} />
                  ) : (
                    <Menu.Item key={item.key} className="nav-sub">
                      {item.label}
                    </Menu.Item>
                  )}
                </>
              );
            } else {
              return item.path === location.pathname ? (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  className="ant-menu-item-selected"
                >
                  <NavLink to={item.path}>{item.label}</NavLink>
                </Menu.Item>
              ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                  <NavLink to={item.path}>{item.label}</NavLink>
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Sider>
    </div>
  );
};

export default NavBar;
