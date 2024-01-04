const gitdetails = {
  state: {
    owner: "",
    projectName: "",
  },
  mutations: {
    setOwner(state, owner) {
      state.owner = owner;
    },
    setProjectName(state, projectName) {
      state.projectName = projectName;
    },
  },
};
export default gitdetails;
