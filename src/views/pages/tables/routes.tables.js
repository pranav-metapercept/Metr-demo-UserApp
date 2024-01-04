import Releasetable from "./releasetable.vue";
import Userroletable from './userroletable.vue'
export default [
  {
    path: "/release",
    component: Releasetable,
    name: "Releasetable",
  },
  {
    path: "/userrole",
    component: Userroletable,
    name: "userrole",
  },
];
