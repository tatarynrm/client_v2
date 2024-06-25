import React, { useEffect, useRef, useState } from "react";
import "./Home.scss";
import axios from "../../utils/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../utils/socket";
import moment from "moment";
import "moment/locale/uk";
import { io } from "socket.io-client";

import { fetchAllZap, fetchZap } from "../../redux/slices/zap";
import { generateUniqueRGBColors } from "../../helpers/colors";
import { todayDate } from "../../helpers/dates";
import { fetchEvents } from "../../redux/slices/events";
import HomeMap from "../../components/maps/HomeMap";
import ExampleDirections from "../../components/map/Map";
import Map from "../../components/map/Map";

ChartJS.register(ArcElement, Tooltip, Legend);
const Home = () => {
  const origin = { lat: 37.7749, lng: -122.4194 }; // Replace with your origin coordinates
  const destination = { lat: 37.7893, lng: -122.4083 };
  const startOfMonth = moment().startOf("month").format("DD.MM.YYYY");
  const endOfMonth = moment().endOf("month").format("DD.MM.YYYY");
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const selectedTheme = localStorage.getItem("selectedTheme");
  const zap = useSelector((state) => state.zap.zap.items);
  const [uniqNames, setUniqNames] = useState([]);
  const [rgb, setRgb] = useState([]);
  const [arr, setArr] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateError, setDateError] = useState(false);
  useEffect(() => {
    if (userData) {
      socket.emit("newUser", userData);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(fetchAllZap(todayDate));
  }, []);

  useEffect(() => {
    const unique = [
      ...new Set(
        zap?.map((item) => {
          return item.PIP;
        })
      ),
    ];
    setUniqNames(unique);
  }, [zap]);

  useEffect(() => {
    if (uniqNames) {
      setRgb(generateUniqueRGBColors(arr.length));
    }
  }, [arr]);

  useEffect(() => {
    const counts = {};
    zap?.forEach(function (element) {
      counts[element.PIP] = 1 + (counts[element.PIP] || 0);
    });
    const result = Object.keys(counts).map(function (key) {
      return { person: key, count: counts[key] };
    });
    setArr(result);
  }, [zap]);

  useEffect(() => {}, [arr]);
  const data = {
    labels: arr.map((item) => item.person),
    datasets: [
      {
        label: "# Заявок",
        data: arr.map((item) => item.count),
        backgroundColor: rgb,
        borderColor: ["rgba(0,0,0,0.1)"],
        borderWidth: 2,
      },
    ],
  };

  const showResultByDate = () => {
    if (dateFrom !== "") {
      dispatch(fetchAllZap(dateFrom));
      setDateError(false);
    } else {
      setDateError(true);
    }
  };
  if (arr.length > 0) {
    return (
      <div className="home container">
        <div className="home__inner">
          <div>
            <h1>
              Доброго дня {userData?.IMJA ? userData?.IMJA : "Користувач"}{" "}
              <br />{" "}
            </h1>
          </div>
          <div className="date__zap-pick">
            <input
              type="date"
              onChange={(e) => {
                setDateFrom(e.target.value);
              }}
            />
            <button className="normal" onClick={showResultByDate}>
              Дивитись
            </button>
            {dateError && <p style={{ color: "red" }}>Оберіть дату</p>}
            {dateFrom ? (
              <span className="show__zap-from-date">
                Дані від {moment(dateFrom).format("ll")}
              </span>
            ) : null}
          </div>
          <div className="chart__container">
            {rgb ? (
              <Doughnut
                data={data}
                options={{
                  color: "gray",
                }}
              />
            ) : null}
          </div>
        </div>
        {/* <GoogleMapZap/> */}
      </div>
    );
  }
  return (
    <div className="home container">
      <p>Перейдіть на вкладку завантаження</p>
    </div>
  );
};

export default Home;
