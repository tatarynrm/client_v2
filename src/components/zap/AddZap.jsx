import { useEffect, useRef, useState } from "react";
import "./AddZap.scss";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { fetchZap, addReduxZap } from "../../redux/slices/zap";
import socket from "../../utils/socket";
import { beep } from "../../helpers/audio";
import { changeAddZapSuccess, editZapAddSlice } from "../../redux/slices/edit";
// import { io } from "socket.io-client";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Link } from "react-router-dom";
import AutoCompleteUr from "./AutoCompleteUr";
import { AiOutlineCloseCircle } from "react-icons/ai";

const AddZap = ({ selectedGroup, showAddZap, setAddZap }) => {
  const zap = useSelector((state) => state.zap.zap.items);
  const userData = useSelector((state) => state.auth.data);
  const [allInfo, setAllInfo] = useState(null);
  const [zav, setZav] = useState("");
  const [rozv, setRozv] = useState("");
  const [zapText, setZapText] = useState("");
  const [zapType, setZapType] = useState(null);
  const [zam, setZam] = useState(false);
  const [zamData, setZamData] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [search, setSearch] = useState("");
  const [zapCina, setZapCina] = useState(false);
  const [countCar, setCountCar] = useState(1);
  const dispatch = useDispatch();
  const options = ["one", "two", "three"];
  const defaultOption = options[0];
  const handleCountCarsChange =(e)=>{
    setCountCar(e.target.value);
  }

  const handleCheckboxChange = () => {
    setZapCina((prevChecked) => !prevChecked);
  };
  const handleZamData = (item) => {
    setZamData({
      zamName: item.NDOV,
      zamKod: item.KOD,
    });
    setZam((value) => !value);
  };
  const clearZamData = (item) => {
    setZamData(null);
    setZam((value) => !value);
    setSearch("");
  };
  const handleSubmitAddZap = async (e) => {
    e.preventDefault();
    const object = {
      pKodAutor: userData.KOD,
      pKodGroup: selectedGroup,
      pZav: zav.label,
      pRozv: rozv.label,
      pZapText: zapText,
      PIP: userData.PIP,
      zavInfo: zav,
      rozvInfo: rozv,
      pZapCina: zapCina ? 1 : 0,
      pKodZam: zamData?.zamKod || null,
      pKilAm:+countCar,
      pPunktZ:zav.value?.terms[0].value,
      pPunktR:rozv.value?.terms[0].value,
    };

    try {
      if ((zav !== "" || rozv !== "" || zapType === null, zapText === "")) {
        alert("Заповніть усіполя");
      } else {
        const data = await axios.post("/zap/add", object);
        if (data.status === 200) {

          const dataKod = data.data.outBinds.pKodZap;
          const zamName = data.data.outBinds.pZamName;
          socket.emit("newZap", {
            ...object,
            ZAP_KOD: dataKod,
            ZAM_NAME: zamName,
          });
          dispatch(editZapAddSlice());
          dispatch(changeAddZapSuccess());
          setTimeout(() => {
            dispatch(changeAddZapSuccess());
          }, 4000);
        } else {
          alert("Виникла якась помилка");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, [zap]);

  useEffect(() => {
    if (search.length > 2) {
      const getContrAgents = async (search) => {
        try {
          const { data } = await axios.post("/ur/all", { search: search });
          setCarriers(data);
        } catch (error) {
          console.log(error);
        }
      };
      getContrAgents(search);
    }
    if (search.length === 0) {
      setTimeout(() => {
        setCarriers([]);
      }, 500);
    }
  }, [search]);
 console.log(carriers);
  return (
    <form onSubmit={handleSubmitAddZap} className="add__zap">
      {zam ? (
        <span className="zam__choose">
          {zamData.zamName}
          <span onClick={clearZamData}>
            <AiOutlineCloseCircle />
          </span>
        </span>
      ) : (
        <div className="form__control">
          <input
            className="search__input"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="carriers__items">
            {carriers.length > 0
              ? carriers.map((item, idx) => {
                  return (
                    <div className="carriers__item" key={idx}>
                      <p className="">{item.NDOV}</p>

                      <span
                        onClick={(e) => handleZamData(item)}
                        className="normal"
                        style={{ cursor: "context-menu", padding: "0.4rem" }}
                      >
                        Обрати замовника
                      </span>
                    </div>
                  );
                })
              : "Напишіть назву компанії"}
          </div>
        </div>
      )}

      <div className="form__control">
        <GooglePlacesAutocomplete
          className="okkk"
          apiKey="AIzaSyDddHSvr8KFFahBGyqLCQVxpjCsFw-p5ek"
          apiOptions={{
            language: "uk",
          }}
          selectProps={{
            zav,
            onChange: setZav,
            placeholder: "Місто завантаження",
          }}
        />
      </div>
      <div className="form__control">
        <GooglePlacesAutocomplete
          apiKey="AIzaSyDddHSvr8KFFahBGyqLCQVxpjCsFw-p5ek"
          apiOptions={{
            language: "uk",
          }}
          selectProps={{
            rozv,
            onChange: setRozv,
            placeholder: "Місто вивантаження",
          }}
        />
      </div>
      <div className="form__control">
        <label className="cina__zap">Запит ціни</label>
        <input
          type="checkbox"
          checked={zapCina}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="form__control">
        <label className="cina__zap">К-сть авто</label>
        <input
          type="number"
          min="0"
          max="100"
          value={countCar}
          onChange={handleCountCarsChange}
        />
      </div>
      <div className="form__control">
        <textarea
          onChange={(e) => setZapText(e.target.value)}
          type="text"
          placeholder="Додаткова інформація по вантажу"
        />
      </div>

      <button className="normal">Добавити</button>
    </form>
  );
};

export default AddZap;
