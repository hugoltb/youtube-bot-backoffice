import axios from "axios";
import { CREDIT_TYPE, METHOD } from "context/constant";
import { API_URL, STORAGE } from "utils/utils";

const ENDPOINT = {
  GET_USER: ({ page, pageLimit, query }) =>
    `${API_URL}/user?page=${page}&limit=${pageLimit}&query=${query}`,
  ADD_USER: `${API_URL}/user`,
  UPDATE_USER: (userId) => `${API_URL}/user/${userId}`,
  DELETE_USER: (userId) => `${API_URL}/user/${userId}`,
  CHANGE_STATUS: (userId) => `${API_URL}/user/is-active/${userId}`,
};

const UserService = {
  getAllUser: (pagination) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_USER(pagination),
      headers: { Authorization: `${STORAGE.GET("token")}` },
    });
  },

  addUser: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.ADD_USER,
      headers: { Authorization: `${STORAGE.GET("token")}` },
      data,
    });
  },

  updateUserById: (userId, data) => {
    return axios({
      method: METHOD.PUT,
      url: ENDPOINT.UPDATE_USER(userId),
      headers: { Authorization: `${STORAGE.GET("token")}` },
      data,
    });
  },

  removeUserById: (userId) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.DELETE_USER(userId),
      headers: { Authorization: `${STORAGE.GET("token")}` },
    });
  },

  changeUserStatus: (userId) => {
    return axios({
      method: METHOD.PUT,
      url: ENDPOINT.CHANGE_STATUS(userId),
      headers: { Authorization: `${STORAGE.GET("token")}` },
    });
  },
};

export default UserService;
