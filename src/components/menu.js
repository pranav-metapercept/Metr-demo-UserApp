import axios from "axios";
import { URL } from "../api/global.env.js";
import CryptoJS from "crypto-js";
import { secretKey } from "../api/global.env.js";

export const menuItems = [
  {
    id: 1,
    label: "menuitems.menu.text",
    isTitle: true,
  },
  {
    id: 2,
    label: "menuitems.dashboard.text",
    icon: "mdi mdi-view-dashboard",
    link: "/dashboard",
    hide: false,
  },
  {
    id: 3,
    label: "menuitems.docmanager.text",
    icon: "mdi mdi-file-document-outline",
    link: "/docmanager",
    hide: false,
  },
  {
    id: 4,
    label: "menuitems.doceditor.text",
    icon: "ri-file-edit-fill",
    link: "/doceditor",
    hide: false,
  },
  {
    id: 5,
    label: "menuitems.docpublisher.text",
    icon: "ri-settings-5-fill",
    link: "/docpublisher",
    hide: false,
  },
  {
    id: 6,
    label: "menuitems.docmigration.text",
    icon: "mdi mdi-file-replace",
    link: "/docmigration",
    // hide: false,
    disabled: false,
  },
];
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    return null;
  }
};
const userId = decryptData(localStorage.getItem("userId"));
axios
  .get(`${URL}api/orguser/details?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
      sessionId: decryptData(localStorage.getItem("sessionId")),
      userId: decryptData(localStorage.getItem("userId")),
      orgId: decryptData(localStorage.getItem("orgId")),
    },
  })
  .then((response) => {
    const userRole = response.data.userRole;
    const docMigrationExists = userRole.includes("DocMigration");
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].label === "DocMigration") {
        // menuItems[i].hide = !docMigrationExists;
        menuItems[i].disabled = !docMigrationExists;
        if (menuItems[i].disabled) {
          menuItems[i].link = "/noaccess";
        }
        break;
      }
    }
    // Hide the "DocMigration" menu item from the DOM if necessary
    const docMigrationItem = document.querySelector('.menu-item[data-id="6"]');
    if (docMigrationItem && docMigrationItem.style) {
      if (menuItems[5].hide) {
        docMigrationItem.style.display = "none";
      } else {
        docMigrationItem.style.display = "";
      }
    }
  })
  .catch(() => {
   
  });
