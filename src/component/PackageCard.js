import React from "react";
import { Col, Card, Button } from "antd";
import imgDefault from "assets/image/default-package-image.jpg";
import { DeleteOutlined, DollarCircleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import PackageService from "services/PackageService";
import { PUBLIC_IMAGE_URL } from "utils/utils";

const PackageCard = ({ selectPackage, fetchPackage, item, idx }) => {
  let urlImage = item?.image
    ? `${PUBLIC_IMAGE_URL}/product/${item?.image}`
    : imgDefault;

  const handleDelete = (event) => {
    event.stopPropagation();
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: `คุณต้องการลบ "${item?.name}" ใช่หรือไม่`,
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
        PackageService.deletePackage(item?._id)
          .then(() => {
            Swal.fire("ดำเนินการสำเร็จ", `ลบแพ็คเกจสำเร็จ`, "success");
            fetchPackage();
          })
          .catch(() => {});
      }
    });
  };
  return (
    <Col key={idx} xs={24} sm={12} xl={6} style={{ marginTop: "12px" }}>
      <Card
        onClick={() => selectPackage(item)}
        title={item?.name}
        bordered={false}
        className="card-vol-1 package-card-hightlight"
        cover={
          <img
            alt={item?.name}
            src={urlImage}
            height={380}
            style={{ borderRadius: "0px" }}
          />
        }
      >
        <div className="package-detail">
          <span className="package-title">Price :</span> {item?.price}{" "}
          <DollarCircleOutlined className="coin-icon" />
        </div>
        <div className="package-detail">
          <span className="package-title"> Amount : </span>{" "}
          {item?.views?.toLocaleString()} Views
        </div>

        <div className="package-detail">
          <span className="package-title">Detail : </span>
        </div>

        <ul className="package-detail" style={{ fontSize: "14px" }}>
          {item?.detail && <li>{item?.detail}</li>}
          <li>Video Must be Open for all Countries 100%</li>
          <li>Safe & Guarantee</li>
          <li>No Password Required</li>
          <li>Delivery Time 1-2 Days</li>
        </ul>

        <Button
          type="primary"
          danger
          style={{ position: "absolute", right: "10px", top: "10px" }}
          onClick={(event) => handleDelete(event)}
          icon={<DeleteOutlined />}
        />
      </Card>
    </Col>
  );
};

export default PackageCard;
