import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Space,
  Divider,
  Select,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { formatDateTime, removeKeyEmpty } from "utils/utils";
import UserService from "services/UserService";

const UIUser = () => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  // === MODAL CONTROL === //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAccHistoryOpen, setIsModalAccHistoryOpen] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);


  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserList();
  }, [page, pageLimit, query]);


  const fetchUserList = () => {
    let pageConf = { page, pageLimit, query };

    UserService.getAllUser(pageConf)
      .then(({ data }) => {
        let { items, total } = data;
        setUserList(data);
        setTotalItems(total);
      })
      .catch(() => {
        setUserList([]);
        setTotalItems(0);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else if (isModalAccHistoryOpen) {
      setIsModalAccHistoryOpen(false);
    }

    setCurrentUser({});
    setIsEdit(false);
    form.resetFields();
  };

  const onFinish = (formValue) => {
    let { email, password } = formValue;
    let reqData = {};
    if (!isEdit) {
      reqData = { email, password };
      UserService.addUser({ email, password  })
        .then(() => {
          setIsModalOpen(false);
          Swal.fire({
            title: "สำเร็จ!",
            text: "เพิ่มสมาชิกสำเร็จ",
            icon: "success",
          });
          fetchUserList();
          handleCloseModal();
        })
        .catch((err) => {
          Swal.fire({
            title: "ผิดพลาด!",
            text: err.response.data.message,
            icon: "error",
          });
        });
    } else {
      reqData = removeKeyEmpty(formValue, ["username"]);

      UserService.updateUserById(currentUser?._id, reqData)
        .then((res) => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "แก้ไขผู้ใช้งานสำเร็จ",
            icon: "success",
          });
          fetchUserList();
          handleCloseModal();
        })
        .catch((err) => {
          Swal.fire({
            title: "ผิดพลาด!",
            text: err.response.data.message,
            icon: "error",
          });
        });
    }
  };

  const handleEditUser = (record) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentUser(record);

    form.setFieldValue("email", record?.email);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (text, record, idx) => (page - 1) * 10 + (idx + 1),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{email}</span>
      ),
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => formatDateTime(createdAt),
    },
    {
      title: "UPDATED AT",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (updatedAt) => formatDateTime(updatedAt),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        let info = status
          ? { title: "Active", color: "green" }
          : { title: "Suspended", color: "red" };
        return (
          <Tag
            color={info?.color}
            onClick={(e) => {
              e.stopPropagation();
              changeUserStatus(record._id);
            }}
          >
            {info?.title}
          </Tag>
        );
      },
    },
    {
      title: "TOOLS",
      dataIndex: "tools",
      key: "tool",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            className="less-padding"
            type="primary"
            danger
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(record);
            }}
          >
            
            {<DeleteOutlined />}
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteUser = ({ _id }) => {
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: "ต้องการลบใช่หรือไม่",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        confirmButton: "confirm-button-class",
        title: "title-class",
        icon: "icon-class",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        UserService.removeUserById(_id)
          .then(() => {
            Swal.fire("สำเร็จ", `ลบผู้ใช้งานสำเร็จ`, "success");
            fetchUserList();
          })
          .catch(() => {
            Swal.fire("ผิดพลาด", `กรุณาลองใหม่อีกครั้ง`, "error");
          });
      }
    });
  };

  const changeUserStatus = (_id) => {
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: "ต้องการเปลี่ยนสถานะใช่หรือไม่",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        confirmButton: "confirm-button-class",
        title: "title-class",
        icon: "icon-class",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        UserService.changeUserStatus(_id)
          .then(() => {
            Swal.fire("สำเร็จ", `เปลี่ยนสถานะผู้ใช้งาน สำเร็จ`, "success");
            fetchUserList();
          })
          .catch(() => {
            Swal.fire("ผิดพลาด", `กรุณาลองใหม่อีกครั้ง`, "error");
          });
      }
    });
  };

  const rowClassName = () => {
    return "clickable-row";
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "18px" }}>Users Management</h1>
        <Button
          type="primary"
          onClick={showModal}
          style={{ width: "100%", maxWidth: "120px", margin: "0" }}
        >
          Add User
        </Button>
      </div>
      <Card className="card-dashboard" style={{ marginTop: "20px" }}>
        <Table
          dataSource={userList}
          columns={columns}
          onRow={(record) => ({
            onClick: () => handleEditUser(record),
          })}
          rowClassName={rowClassName}
          scroll={{ x: 900 }}
          style={{ marginTop: "10px" }}
          pagination={false}
        />
        <Pagination
          showSizeChanger
          total={totalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={page}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setPage(newPage)}
          onShowSizeChange={(current, limit) => setPageLimit(limit)}
        />
      </Card>

      <Modal
        title={`${isEdit ? "Edit" : "Add"} User`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            form="addUserForm"
            key="submit"
            htmlType="submit"
            type="primary"
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          id="addUserForm"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input disabled={isEdit} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: !isEdit,
                message: "Please input your password!",
              },
              { min: 6, message: "Password must be 6-20 characters" },
              {
                max: 20,
                message: "Password must be 6-20 characters",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Divider />


        </Form>
      </Modal>

    </div>
  );
};

export default UIUser;
