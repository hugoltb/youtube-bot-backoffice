import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL, STORAGE } from "utils/utils";

const ENDPOINT = {
  GET_YT_CH: `${API_URL}/youtube/channel`,
  ADD_CH: `${API_URL}/youtube/channel`,
  GET_KEYWORD: `${API_URL}/config?key=keyword`,
  PATCH_KEYWORD: `${API_URL}/config`,
  DELETE_CH: (chId) => `${API_URL}/youtube/channel/${chId}`,
  AUTH: {
    SIGN_IN: `${API_URL}/auth/sign-in`,
  },
};

const SystemService = {
  getYoutubeCh: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_YT_CH,
      headers: { Authorization: `${STORAGE.GET("token")}` },
    });
  },

  addCh: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.ADD_CH,
      headers: { Authorization: `${STORAGE.GET("token")}` },
      data,
    });
  },

  getKeyword: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_KEYWORD,
      headers: { Authorization: `${STORAGE.GET("token")}` },
    });
  },

  patchKeyword: (data) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.PATCH_KEYWORD,
      headers: { Authorization: `${STORAGE.GET("token")}` },
      data,
    });
  },

  removeChById: (chId) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.DELETE_CH(chId),
      headers: { Authorization: `${STORAGE.GET("token")}` },
    });
  },


  userLogin: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.AUTH.SIGN_IN,
      headers: { Authorization: `Bearer ${STORAGE.GET("token")}` },
      data,
    });
  },
};

export default SystemService;
