
import axios from "axios";
import { encode } from 'base-64';
import {boot} from "quasar/wrappers";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const env = import.meta.env;
const api = axios.create({ baseURL: env.VITE_API_BASE_URL });

export default boot(({ app }) => {

  api.interceptors.request.use(
    (config) => {
      //let localToken = JSON.parse(localStorage.getItem("token"));
      const userEmail = env.VITE_ALEGRA_EMAIL;
      const userToken = env.VITE_ALEGRA_TOKEN;

      const base64Credentials = encode(`${userEmail}:${userToken}`);
      config.headers["Authorization"] = `Basic ${base64Credentials}`;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
