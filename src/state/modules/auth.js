import { unauthClient, apiDefaults, axios } from "@/api/index.js";
import store from "@/state/store";
import { URL } from "@/api/global.env";
import CryptoJS from "crypto-js";
import { secretKey } from "../../api/global.env";
const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
};
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    return null;
  }
};
const updateLocalStorage = (key, data) => {
  localStorage.setItem(key, encryptData(data));
};
const Auth = {
  state: () => ({
    token: decryptData(localStorage.getItem("token")) || null,
    sessionId: decryptData(localStorage.getItem("sessionId")) || null,
    refresh: decryptData(localStorage.getItem("refresh")) || null,
    orgId: decryptData(localStorage.getItem("orgId")) || null,
    userId: decryptData(localStorage.getItem("userId")) || null,
    userEmail: decryptData(localStorage.getItem("userEmail")) || null,
    userName: decryptData(localStorage.getItem("userName")) || null,
    gitToken: decryptData(localStorage.getItem("gitToken")) || null,
    githubUsername: decryptData(localStorage.getItem("githubUsername")) || null,
    isActive: null,
    isDeleted: null,
    isSuperUser: null,
    isEmailVerified: null,
    unauthClient: unauthClient,
    ditaOtVersions: [],
    notificationData: [],
    recentPublicationsData: [],
    projectsData: [],
    projectsList: [],
    repoUser: "",
    repoName: "",
    orgDetails: "",
    isWorkspaceCreated:'',
    endpoints: {
      obtain: "/orguser/authenticate",
    },
  }),
  mutations: {
    updateTokens(state, tokens) {
      updateLocalStorage("token", tokens.token);
      updateLocalStorage("refresh", tokens.refresh);
      updateLocalStorage("orgId", tokens.orgId);
      updateLocalStorage("userId", tokens.userId);
      updateLocalStorage("userEmail", tokens.userEmail);
      updateLocalStorage("userName", tokens.userName);
      updateLocalStorage("githubUsername", tokens.githubUsername);
      state.token = tokens.token;
      state.refresh = tokens.refresh;
      state.orgId = tokens.orgId;
      state.userId = tokens.userId;
      state.userEmail = tokens.userEmail;
      state.userName = tokens.userName;
      state.gitToken = tokens.gitToken;
      state.githubUsername = tokens.githubUsername;
      state.isActive = tokens.isActive;
      state.isDeleted = tokens.isDeleted;
      state.isSuperUser = tokens.isSuperUser;
      state.isEmailVerified = tokens.isEmailVerified;
    },
    updateSessionId(state, sessionId) {
      state.sessionId = sessionId;
      updateLocalStorage("sessionId", sessionId);
    },
    updateUserId(state, userId) {
      state.userId = userId;
      localStorage.setItem("userId", userId);
    },
    updateAccess(state, token) {
      localStorage.setItem("token", token);
      state.token = token;
    },
    updateGitToken(state, token) {
      updateLocalStorage("gitToken", token.gitToken);
      state.gitToken = token.gitToken;
    },
    updateActiveStatus(state, token) {
      state.isActive = token.isActive;
    },
    updateDeletedStatus(state, token) {
      state.isDeleted = token.isDeleted;
    },
    updateSuperUserStatus(state, token) {
      state.isSuperUser = token.isSuperUser;
    },
    updateEmailVerifiedStatus(state, token) {
      state.isEmailVerified = token.isEmailVerified;
    },
    removeToken(state) {
      localStorage.setItem("token", null);
      localStorage.setItem("sessionId", null);
      localStorage.setItem("refresh", null);
      localStorage.setItem("reponame", null);
      localStorage.setItem("orgId", null);
      localStorage.setItem("userId", null);
      localStorage.setItem("userName", null);
      localStorage.setItem("userEmail", null);
      localStorage.setItem("gitToken", null);
      state.token = null;
      state.sessionId = null;
      state.refresh = null;
      state.orgId = null;
      state.userId = null;
      state.userEmail = null;
      state.userName = null;
      state.gitToken = null;
      state.githubUsername = null;
      state.isActive = null;
      state.isDeleted = null;
      state.isSuperUser = null;
      state.isEmailVerified = null;
    },
    SET_DITA_OT_VERSIONS(state, versions) {
      state.ditaOtVersions = versions;
    },
    setNotificationData(state, data) {
      state.notificationData = data;
    },
    setRecentPublicationsData(state, data) {
      state.recentPublicationsData = data;
    },
    setProjectsData(state, data) {
      state.projectsData = data;
    },
    setProjectsList(state, data) {
      state.projectsList = data;
    },
    setRepoUser(state, data) {
      state.repoUser = data;
    },
    setRepoName(state, data) {
      state.repoName = data;
    },
    setOrgDetails(state, data) {
      state.orgDetails = data;
    },
    setWorkspaceStatus(state ,data){
      state.isWorkspaceCreated = data
    }
  },
  getters: {
    client: (state) => {
      const apiClient = axios.create({
        ...apiDefaults,
        headers: {
          Authorization: `Bearer ${state.token}`,
          sessionId: state.sessionId,
          userId: state.userId,
          orgId: state.orgId,
          gitToken: `${state.gitToken}`,
        },
      });
      apiClient.interceptors.response.use(
        (response) => {
          // Return a successful response back to the calling service
          return response;
        },
        (error) => {
          // Return any error which is not due to authentication back to the calling service
          if (error.response.status !== 401) {
            return new Promise((resolve, reject) => {
              reject(error);
            });
          }
          // Logout user if token refresh didn't work or user is disabled
          if (
            error.config.url == `${URL}api/token/refresh/` ||
            error.response.message == "Account is disabled."
          ) {
            // window.location.href = "/";
            return new Promise((reject) => {
              reject(error);
            });
          }
          // Try request again with new token
          return apiClient
            .post(`${URL}accounts/token/refresh/`, {
              refresh: localStorage.getItem("refresh"),
            })
            .then((response) => {
              // New request with new token
              const config = error.config;
              store.commit("updateAccess", {
                token: response.data.token,
              });
              config.headers["Authorization"] = `Bearer ${response.data.token}`;
              return new Promise((resolve, reject) => {
                apiClient
                  .request(config)
                  .then((response) => {
                    resolve(response);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            })
            .catch((error) => {
              Promise.reject(error);
            });
        }
      );
      return apiClient;
    },
    ditaOtVersions: (state) => state.ditaOtVersions,
  },
  actions: {
    obtainToken(context, authDetails) {
      return context.state.unauthClient
        .post(context.state.endpoints.obtain, authDetails)
        .then((response) => {
          this.commit("updateTokens", {
            token: response.data.token,
            refresh: response.data.refresh,
            orgId: response.data.orgId,
            userEmail: response.data.email,
            userName: response.data.username,
            userId: response.data.id,
            githubUsername: response.data.githubUsername,
          });
          this.commit("updateEmailVerifiedStatus", {
            isEmailVerified: response.data.isEmailVerified,
          });
          this.commit("updateGitToken", {
            gitToken: response.data.gitToken,
          });
          this.commit("updateActiveStatus", {
            isActive: response.data.isActive,
          });
          this.commit("updateDeletedStatus", {
            isDeleted: response.data.isDeleted,
          });
          this.commit("updateSuperUserStatus", {
            isSuperUser: response.data.isSuperUser,
          });
        });
    },
    refreshToken(context) {
      const payload = {
        refresh: context.state.refresh,
      };
      context.state.unauthClient
        .post(context.state.endpoints.refresh, payload)
        .then((response) => {
          this.commit("updateAccess", response.data.token);
        })
        .catch(() => {});
    },
    registerUser(context, authDetails) {
      return context.state.unauthClient
        .post(context.state.endpoints.register, authDetails)
        .then(() => {});
    },
    fetchDitaOtVersions({ commit }, orgId) {
      return axios
        .get(`${URL}api/serveradmin/organization/byorgid?orgId=${orgId}`, {
          headers: {
            Authorization: `Bearer ${decryptData(
              localStorage.getItem("token")
            )}`,
            sessionId: decryptData(localStorage.getItem("sessionId")),
            userId: decryptData(localStorage.getItem("userId")),
            orgId: decryptData(localStorage.getItem("orgId")),
          },
        })
        .then((response) => {
          const ditaOtVersions = response.data[0].ditaotVersion;
          commit("SET_DITA_OT_VERSIONS", ditaOtVersions);
          return ditaOtVersions;
        })
        .catch((error) => {
          throw error;
        });
    },
  },
};
export default Auth;
