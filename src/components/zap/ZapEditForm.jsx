import { useEffect, useState } from "react";
import "./ZapEditForm.scss";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { editZapRedux } from "../../redux/slices/edit";
import axios from "../../utils/axios";
import socket from "../../utils/socket";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Switch } from "antd";
const ZapEditForm = () => {
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const [zav, setZav] = useState("");
  const [rozv, setRozv] = useState("");
  const [zapText, setZapText] = useState("");
  const zapEditData = useSelector((state) => state.edit.zapEditData);
  console.log(zapEditData);
  const [zapPrice, setZapPrice] = useState(
    zapEditData?.zapCina === 1 ? true : false
  );
  const [zapPriceValue, setZapPriceValue] = useState(
    zapEditData?.zapCina === 1 ? 0 : 1
  );

  const [selectedOption, setSelectedOption] = useState(
    zapEditData?.zapGroup || selectedOption
  );
  const handleEditZapCina = async () => {
    const obj = {
      pKodZap: zapEditData?.zapKod,
      pZapCina: zapPriceValue,
      pKodAuthor: zapEditData?.zapKodOs,
    };
    try {
      const data = await axios.post(`/zap/edit-zap-cina`, obj);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleZapCinaChange = async (e) => {
    if (e === true) {
      setZapPriceValue(1);
      handleEditZapCina();
      // setTimeout(()=>{
      //   dispatch(editZapRedux());
      // },1000)
    } else {
      setZapPriceValue(0);
      handleEditZapCina();
      // setTimeout(()=>{
      //   dispatch(editZapRedux());
      // },1000)
    }
  };
  console.log(zapPriceValue);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // console.log(zapEditData);
  const handleEditForm = async (e) => {
    e.preventDefault();

    const obj = {
      pKodAuthor: zapEditData?.zapKodOs,
      pKodZap: zapEditData?.zapKod,
      pZav: zav.label,
      pRozv: rozv.label,
      pZapText: zapText,
      pKodAuthor: userData.KOD,
      pZav: zav.label,
      pRozv: rozv.label,
      pZapText: zapText,
      PIP: userData.PIP,
      zavInfo: zav,
      rozvInfo: rozv,
      pZapCina: zapEditData.zapCina ? 1 : 0,
      pKodZam: zapEditData?.zapKodZam || null,
      pKilAm: zapEditData?.pKilAm,
    };
    try {
      if (zav === "" || rozv === "" || zapText === "") {
        window.alert("Заповніть усі поля");
      } else {
        const data = await axios.post(`/zap/edit`, obj);
        if (data.status === 200) {
          socket.emit("editZap", obj);
          alert(`Ви успішно редагували заявку № ${obj.pKodZap} `);
          dispatch(editZapRedux());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditText = async (e) => {
    e.preventDefault();

    const obj = {
      pKodZap: zapEditData?.zapKod,
      pZapText: zapText,
    };
    try {
      if (zapText === "") {
        window.alert("Заповніть усі поля");
      } else {
        const data = await axios.post(`/zap/edit-text`, obj);
        if (data.status === 200) {
          socket.emit("editZapText", obj);
          alert(`Ви успішно редагували текст до  заявки № ${obj.pKodZap} `);
          dispatch(editZapRedux());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setZav(zapEditData?.zav);
    setRozv(zapEditData?.rozv);
    setZapText(zapEditData?.zapText);
  }, [zapEditData]);
  useEffect(() => {}, [zapEditData]);
  return (
    <div className="zap__edit-form">
      {zapEditData && (
        <form className="zap__edit_form">
          <h3 style={{ color: "brown" }}>
            Необхідно знову внести місто завантаження та вивантаження. <br />
            Також можете виправити лише текст заявки. <br />
            Або натисніть кнопку Відхилити
          </h3>
          <div className="form__control">
            <GooglePlacesAutocomplete
              className="okkk"
              apiKey="AIzaSyDddHSvr8KFFahBGyqLCQVxpjCsFw-p5ek"
              apiOptions={{
                language: "uk",
              }}
              value={zav}
              selectProps={{
                defaultInputValue: zav,
                isClearable: true,
                value: zav,
                onChange: setZav,
                placeholder: "Введіть місто завантаження",
              }}
            />
          </div>
          <div className="form__control">
            <GooglePlacesAutocomplete
              className="okkk"
              apiKey="AIzaSyDddHSvr8KFFahBGyqLCQVxpjCsFw-p5ek"
              apiOptions={{
                language: "uk",
              }}
              selectProps={{
                defaultInputValue: rozv,
                isClearable: true,
                value: rozv,
                onChange: setRozv,
                placeholder: "Введіть місто вивантаження",
              }}
            />
          </div>
          <div className="form__control">
            <textarea
              value={zapText}
              onChange={(e) => setZapText(e.target.value)}
              type="text"
              placeholder="Додаткова інформація по вантажу"
              name="download"
              cols="10"
              rows="5"
              style={{
                resize: "none",
                fontSize: "20px",
                outline: "none",
                border: "none",
                borderRadius: "10px",
                padding: "0.4rem",
              }}
            />
          </div>
          <div className="zap__edit_form-buttons">
            <button className="normal" onClick={handleEditForm}>
              Редагувати
            </button>
            <button className="normal" onClick={handleEditText}>
              Редагувати лише текст
            </button>
            <button onClick={() => dispatch(editZapRedux())} className="danger">
              Відхилити
            </button>
            <FormControl display="flex" alignItems="center">
              <FormLabel color={"white"} htmlFor="email-alerts" mb="0">
                Змінити статус <br />
                Заявка - Запит ціни
              </FormLabel>
              <Switch
                id="email-alerts"
                defaultChecked={zapEditData?.zapCina}
                onChange={handleZapCinaChange}
              />
            </FormControl>
          </div>
        </form>
      )}
    </div>
  );
};

export default ZapEditForm;
