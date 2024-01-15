import axios from "axios";
import { URL } from "@/api/global.env";

const apiDefaults = {
  baseURL: `${URL}api`,
  timeout: 1000000,
};

const unauthClient = axios.create({
  baseURL: `${URL}api`,
  timeout: 1000000,
});

export { unauthClient, apiDefaults, axios };
