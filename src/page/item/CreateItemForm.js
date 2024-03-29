import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createItem } from "../../feature/item/itemSlice";
import axios from "axios";
import "./item.css";
import { Form } from "react-bootstrap";
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { image } from "@cloudinary/url-gen/qualifiers/source";
const CreateItemForm = ({ state }) => {
  const [seen, setSeen] = useState(state);
  const [information, setInformation] = useState({
    price: 0,
    type: "1",
    city: "",
    region: "",
    images: [],
    mainImage: "",
    description: "",
  });

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    setInformation((prevState) => ({
      ...prevState,
      [e.target.name]:
        e.target.name !== "images" && e.target.name !== "mainImage"
          ? e.target.value
          : e.target.name !== "images"
            ? e.target.files[0]
            : Array.from(e.target.files),
    }));
    console.log(information);
  };

  const onSubmitHnadler = async (e) => {
    e.preventDefault();

    if (information.price === 0 ||
      information.city === "" ||
      information.region === "" ||
      information.mainImage === "" ||
      information.description === "") {
      toast.error("املا جميع الفراغات لو سمحت");
      return;
    }

    if (information.images.length === 0) {
      toast.error("اختر صورة اضافية واحدة على الاقل لو سمحت");
      return;
    }
    const formData = new FormData();
    formData.append("file", information.mainImage);
    formData.append("upload_preset", "l0moj8hc");
    const d1 = await axios.post(
      "https://api.cloudinary.com/v1_1/dim6g5ogz/image/upload",
      formData
    );
    const { public_id } = d1.data;
    information.mainImage = public_id;

    for (let i = 0; i < information.images.length; i++) {
      const formData = new FormData();
      formData.append("file", information.images[i]);
      formData.append("upload_preset", "l0moj8hc");
      const d1 = await axios.post(
        "https://api.cloudinary.com/v1_1/dim6g5ogz/image/upload",
        formData
      );
      const { public_id } = d1.data;
      information.images[i] = public_id;
    }
    console.log(information);
    const data = dispatch(createItem({ item: information, userId: user._id }));
    console.log(data);

    toast.success('تم اضافة العرض بنجاح')
    window.location.reload();
  };

  const onCloseHandler = (e) => {
    setSeen(false);
  }

  return (
    <>
      <button onClick={() => setSeen(!seen)}><AddIcon />اضافة سكن</button>
      <Modal open={seen} className="model">

        <form className="createItemForm" onSubmit={onSubmitHnadler}>
          <ToastContainer />
          <div className="itemHeader">
            <h3>اضافة سكن جديد</h3>
          </div>
          <div className="inputSection">
            <Form.Group className="inputItem">
              <Form.Label>المدينة</Form.Label>
              <Form.Control onChange={onChangeHandler} name="city" />
            </Form.Group>
            <Form.Group className="inputItem">
              <Form.Label>المنطقة داخل المدينة</Form.Label>
              <Form.Control onChange={onChangeHandler} name="region" />
            </Form.Group>
          </div>
          <div className="inputSection">
            <Form.Group className="inputItem">
              <Form.Label>السعر</Form.Label>
              <Form.Control onChange={onChangeHandler} name="price" />
            </Form.Group>
            <Form.Select
              className="inputItem"
              onChange={onChangeHandler}
              name="type"
            >
              <option value="1">شقة</option>
              <option value="2">بيت منفصل</option>
            </Form.Select>
          </div>

          <div className="inputSection">
            <Form.Group className="inputItem">
              <Form.Label>التفاصيل</Form.Label>
              <Form.Control as="textarea" rows={5} onChange={onChangeHandler} name="description" />
            </Form.Group>
          </div>
          <div className="inputSection">
            <Form.Group className="inputItem">
              <Form.Label>الصورة الرئيسية</Form.Label>
              <Form.Control
                onChange={onChangeHandler}
                type="file"
                name="mainImage"
              />
            </Form.Group>

            <Form.Group className="inputItem">
              <Form.Label>الصور الاضافية</Form.Label>
              <Form.Control
                onChange={onChangeHandler}
                type="file"
                multiple
                name="images"
              />
            </Form.Group>
          </div>
          <div className="create-form-footer">
            <button>اضافة </button>
            <button onClick={onCloseHandler}>اغلاق </button>
          </div>
        </form>

      </Modal >



    </>
  );
};

export default CreateItemForm;
