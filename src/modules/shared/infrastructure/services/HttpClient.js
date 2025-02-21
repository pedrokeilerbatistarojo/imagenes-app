import axios from "axios";
import { encode } from "base-64";
//import { app } from 'quasar/wrappers';

const env = import.meta.env;

class HttpClient {
  constructor() {
    this.api = axios.create({
      baseURL: env.VITE_API_BASE_URL,
    });

    this.api.interceptors.request.use(
      (config) => {
        const userEmail = env.VITE_ALEGRA_EMAIL;
        const userToken = env.VITE_ALEGRA_TOKEN;
        const base64Credentials = encode(`${userEmail}:${userToken}`);
        config.headers['Authorization'] = `Basic ${base64Credentials}`;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get(url, params = {}) {
    return await this.api.get(url, { params });
  }

  async post(url, data) {
    return await this.api.post(url, data);
  }

  async put(url, data) {
    return await this.api.put(url, data);
  }

  async delete(url) {
    return await this.api.delete(url);
  }
}

export const api = new HttpClient();
