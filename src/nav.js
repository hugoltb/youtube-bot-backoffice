import {
  AppstoreOutlined,
  UserOutlined,
  BarChartOutlined,
  ExportOutlined,
  DollarOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const nav = [
  { label: "MENU", key: "sub1", type: "sub" },
  {
    key: "1",
    icon: <BarChartOutlined className="icon-menubar" />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "2",
    icon: <AppstoreOutlined className="icon-menubar" />,
    label: "Keywords",
    path: "/keywords",
  },
  {
    key: "3",
    icon: <TeamOutlined className="icon-menubar" />,
    label: "Users",
    path: "/users",
  },

  {
    key: "4",
    icon: <ExportOutlined className="icon-menubar" />,
    label: "Logout",
    path: "/",
  },
];
