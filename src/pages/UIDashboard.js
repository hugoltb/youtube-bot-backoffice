import { Col, Row, Table, Button, Tag,Form,Modal,Input,Divider,Space,Select } from "antd";
import React, { useState, useEffect } from 'react';
import {
  formatDateTime,
  getStatusTagDetail,
  removeKeyEmpty
} from "utils/utils";
import SystemService from "services/SystemService";
import Swal from "sweetalert2";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const UIDashboard = () => {
  const [youtubeList, setYoutubeList] = useState([]);
  const [currentYoutube, setCurrentYoutube] = useState({});
  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  // === MODAL CONTROL === //
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { Option } = Select;

  useEffect(() => {
    fetchChannel();
  }, [page, pageLimit, query]);


  const fetchChannel = () => {
    let pageConf = { page, pageLimit, query };

    SystemService.getYoutubeCh(pageConf)
      .then(({ data }) => {
        let { items, total } = data;
        setYoutubeList(data);
        setTotalItems(total);
      })
      .catch(() => {
        setYoutubeList([]);
        setTotalItems(0);
      });
  };


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } 

    setCurrentYoutube({});
    setIsEdit(false);
    form.resetFields();
  };

  const onFinish = (formValue) => {
    let { ch_name, link, status } = formValue;
    let reqData = {};
    if (!isEdit) {
      reqData = { ch_name, link, status };
      SystemService.addCh({ ch_name, link, status  })
        .then(() => {
          setIsModalOpen(false);
          Swal.fire({
            title: "สำเร็จ!",
            text: "เพิ่มข้อมูลสำเร็จ",
            icon: "success",
          });
          fetchChannel();
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

      SystemService.updateUserById(currentYoutube?._id, reqData)
        .then((res) => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "แก้ไขผู้ใช้งานสำเร็จ",
            icon: "success",
          });
          fetchChannel();
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

  const handleDelete = ({ _id }) => {
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
        console.log("_id",_id)
        SystemService.removeChById(_id)
          .then(() => {
            Swal.fire("สำเร็จ", `ลบข้อมูลสำเร็จ`, "success");
            fetchChannel();
          })
          .catch(() => {
            Swal.fire("ผิดพลาด", `กรุณาลองใหม่อีกครั้ง`, "error");
          });
      }
    });
  };

  
  const dataList = [
    {
      createdAt: new Date(2024, 3, 25), 
      ch_name:"Kira",
      link:"https://youtu.be/_R2LiwXtuLQ?list=RDMMWuqjrNLNFdo",
      status: "active",
    },
    {
      createdAt: new Date(2024, 3, 24),
      ch_name:"Imsogood",
      link:"https://youtu.be/1231?list=123213",
      status: "pending",
    },
    {
      createdAt: new Date(2024, 3, 24),
      ch_name:"Ppl",
      link:"https://youtu.be/",
      status: "success",
    },
  ];
  

  const column = [
    {
      title: "TASK ID",
      key: "index",
      render: (text, record, index) => (
        <span style={{ color: "#29f", fontWeight: "bold", cursor: "pointer" }}>
          {index+1}
        </span>
      ),
    },
    {
      title: "Channel Name",
      dataIndex: "ch_name",
      key: "ch_name",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link) => (
        <a target="_blank" href={link}>
          {link}
        </a>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let info = getStatusTagDetail(status);
        return <Tag color={info?.color}>{info.title}</Tag>;
      },
    },
    {
      title: "Lastest Update",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDateTime(createdAt),
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
              handleDelete(record);
            }}
          >
            
            {<DeleteOutlined />}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: "0", fontSize: "18px" }}>Dashboard</h1>
      <Button
        type="primary"
        onClick={showModal}
        style={{ width: "100%", maxWidth: "120px", margin: "0" }}
      >
        Add Task
      </Button>
      </div>
    <Row gutter={[12, 16]} style={{marginTop:"20px"}}>
      <Col sm={24} xl={24}>
        <Row gutter={[30, 16]} className="card-home">

          <Col span={24}>
            <div className="card-vol-1">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
              </div>
              <Table
                dataSource={youtubeList}
                columns={column}
                scroll={{ x: 900 }}
                style={{ marginTop: "10px" }}
                pagination={false}
              />
            </div>
          </Col>
        </Row>
      </Col>

    </Row>
    <Modal
        title={`${isEdit ? "Edit" : "Add"} Youtube Channel`}
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
            label="Channel Name"
            name="ch_name"
            rules={[
              {
                required: true,
                message: "Please input your channel name!",
              },
            ]}
          >
            <Input disabled={isEdit} />
          </Form.Item>

          <Form.Item
            label="Channel Link"
            name="link"
            rules={[
              {
                required: true,
                message: "Please input your channel link!",
              },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please select a status!",
              },
            ]}
          >
              <Select>
                <Option value="pending">Pending</Option>
                <Option value="active">Active</Option>
                <Option value="success">Success</Option>
              </Select>
          </Form.Item>

          <Divider />


        </Form>
      </Modal>
    </div>
  );
};
export default UIDashboard;
