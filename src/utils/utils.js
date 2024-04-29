import { OBSERVER_TRX } from "context/constant";

export const API_URL = process.env.REACT_APP_API_URL;

export const ENV = process.env.NODE_ENV;

export const PUBLIC_IMAGE_URL = process.env.REACT_APP_ASSET_URL;

export const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
export const STORAGE = {
  GET: (key) => sessionStorage.getItem(key),
  SET: (key, value) => sessionStorage.setItem(key, value),
  CLEAR: () => sessionStorage.clear(),
};

const timeTwoDigit = (num) => {
  return (num < 10 ? "0" : "") + num;
};

export const formatDateTime = (time, type) => {
  let d = new Date(time);
  let h = timeTwoDigit(d.getHours());
  let m = timeTwoDigit(d.getMinutes());
  let s = timeTwoDigit(d.getSeconds());

  if (type === "onlyTime") {
    return `${h}:${m}:${s}`;
  } else if (type === "onlyDate") {
    return `${d.toLocaleDateString("th-TH")}`;
  }
  return `${d.toLocaleDateString("th-TH")} - ${h}:${m}:${s}`;
};

export const getDefaultValue = (value) => {
  let val = parseFloat(value).toFixed(2);
  let temp = val.split(".");
  let itg = parseInt(temp[0]).toLocaleString();
  let digit = temp[1];

  return value ? `${itg}.${digit}` : "0.00";
};

export const removeKeyEmpty = (obj, exceptKey) => {
  if (!isObject(obj)) {
    return {};
  }

  if (exceptKey && !Array.isArray(exceptKey)) {
    exceptKey = false;
  }

  let newObj = {};
  for (let key in obj) {
    if (exceptKey && exceptKey.length > 0) {
      for (let exceptK of exceptKey) {
        if (exceptK !== key) {
          if (obj[key] && obj[key] !== undefined) {
            newObj[key] = obj[key];
          }
        }
      }
    } else {
      if (obj[key] && obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
};

const isObject = (obj) => {
  if (typeof obj === "object" && !Array.isArray(obj) && obj !== null) {
    return true;
  }
  return false;
};

// ==== MAP TAG ==== //
export const getStatusTagDetail = (status) => {
  switch (status) {
    case "active":
      return { title: "Active", color: "green" };
    case "success":
      return { title: "Success", color: "lime" };
    case "failed":
      return { title: "Failed", color: "red" };
    default:
      return { title: "Pending", color: "gold" };
  }
};

export const getObserverTrxTagDetail = (status) => {
  switch (status) {
    case OBSERVER_TRX.SUCCESS:
      return { title: "Success", color: "green" };
    case OBSERVER_TRX.ON_PROCESS:
      return { title: "On Process", color: "magenta" };
    case OBSERVER_TRX.PENDING:
      return { title: "Pending", color: "orange" };
    default:
      return { title: "Failed", color: "red" };
  }
};
