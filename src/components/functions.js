import { secretKey } from "../api/global.env";
import CryptoJS from "crypto-js";

function decrypt(res) {
  return CryptoJS.AES.decrypt(res, secretKey).toString(CryptoJS.enc.Utf8);
}

function encrypt(res) {
  return CryptoJS.AES.encrypt(res, secretKey).toString();
}

export default { decrypt, encrypt };
