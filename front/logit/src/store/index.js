import { createStore } from "vuex";
import axios from "axios";
import router from "@/router";
import axiosConnector from "@/utils/axios-connector";
import axiosConnectorFormData from "@/utils/axios-connector-formData";

// import { useRouter } from "vue-router";
// import temp from './modules/temp.js'
// import event from './modules/event.js'
// import timeline from './modules/timeline.js'

// const getToken = () => {
//   const token = sessionStorage.getItem("token");
//   return {
//     Authorization: `bearer ${token}`,
//   };
// }; 

import tempJob from './modules/tempJob.js'
import job from './modules/job.js'
import temp from './modules/temp.js'
import growth from "./modules/growth.js";
import timeline from "./modules/timeline.js";
import search from "./modules/search.js";
import statistics from "./modules/statistics.js";

const baseURL = "https://i8a609.p.ssafy.io/api/user";
// const baseURL = "http://localhost:9090/user";
export default createStore({

  state: {
    loginUser : {},
    sidebar: true,
    myInvitation: [],
  },
  getters: {},
  mutations: {
    LOGIN(state, payload) {
      state.loginUser = payload
    },
    LOG_OUT(state) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("id");
      state.loginUser = {};
      state.myInvitation = [];
      router.replace({name: 'MainPage'})
    },
    GET_USER(state, payload) {
      state.loginUser = payload;
      console.log(state.loginUser);
      router.push({ name: "ProfilePage" });
    },
    GET_USER_ONLY(state, payload){
      state.loginUser = payload;
    },
    GET_MY_INVITATION(state, payload){
      state.myInvitation = payload
      router.push({ name: "MainPage" })
    },
    OPEN_SIDEBAR(state){
      state.sidebar = true;
    },
    CLOSE_SIDEBAR(state){
      state.sidebar = false;
    },
  },
  actions: {
    // 유저 로그인
    login({ commit, dispatch }, user) {
      const URL = `${baseURL}/login`;
      axios({
        url: URL,
        method: "POST",
        data: user,
      }).then((res) => {
        if (res.data.result == "사용자 없음") { 
          alert("사용자가 없습니다.")
          return
        }          
        if (res.data.result == "비밀번호 틀림") { 
          alert("로그인에 실패하였습니다.")
          return
        }
        sessionStorage.setItem("token", res.data["jwt-auth-token"]);
        sessionStorage.setItem('id', res.data.id)
        dispatch('getMyInvitation')
        commit("LOGIN", res.data);
      }).catch((err) => {
        console.log(err);
      });
    },
    // 유저 회원가입하기
    signup(context, user) {
      const URL = `${baseURL}/regist`;
      axios({
        url: URL,
        method: "POST",
        data: user,
      }).then((res) => {
        console.log(res.data)
        if(res.data == 'success'){
          router.push({ name: "UserSignupComplete" });
        }
      }).catch((err) => {
        console.log(err);
      });
    },

    // 유저 로그아웃하기
    logout({ commit }) {
      axiosConnector
        .post("user/logout")
        .then(() => {
          commit("LOG_OUT");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 비밀번호 변경하기 => 고쳐야함
    // updataPassword.vue에 작성

    // 비밀번호 재발급
    sendPw(context, email) {
      const URL = `${baseURL}/sendPw`;
      axios({
        url: URL,
        method: "POST",
        params: { email: email },
      })
      .then(() => {
        console.log("성공");
        // commit("LOGIN_USER", res.data);
      })
      .catch((err) => {
        alert("으악!!!!!!! 로그인 실패");
        console.log(err);
      });
    },

    // 이메일 중복 검사하기
    // UserEmail.vue에 작성

    // 이미지 업로드하기
    // 이미지 정보 갱신 : 이미지 업로드 후(uploadImage) 유저 정보를 불러와(getUser) vuex에 저장
    uploadImage({ dispatch }, formData) {
      axiosConnectorFormData
        .post("user/uploadImage", formData)
        .then((res) => { 
          if (res.data == "success") {
            dispatch("getUser");
          }
        })
        .catch((err) => { 
          console.log(err);
        })
    },

    uploadFile({ dispatch}, formData) {
      axiosConnectorFormData
        .post("user/uploadFile", formData)
        .then((res) => { 
          if (res.data == "success") {
            dispatch("getUser");
          }
          console.log(res.data)
        })
        .catch((err) => { 
          console.log(err);
        })
    },
    
    // 유저 정보 업로드하기
    // 유저 정보 갱신 : 유저 정보 업데이트(updateUser) 유저 정보 불러와(getUser) vuex에 저장
    updateUser({ dispatch }, user) { 
      axiosConnector
        .post("user", user)
        .then((res) => {
          if (res.data.result == "사용자 없음") {
            return
          }       
            dispatch("getUser");
        })
        .catch((err) =>{ 
        alert("유저 정보 업데이트 실패해쓰어 ~~")
          console.log(err);
        })
    },

    // 유저 정보 가져오기
    getUser({ commit }) {
      axiosConnector
        .get("user")
        .then((res) => {
          commit("GET_USER", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // profile page로 가지 않을 getUser
    getUserOnly({commit}){
      axiosConnector.get(`user`
      ).then((res)=>{
        commit('GET_USER_ONLY', res.data)
      }).catch((err)=>{
        console.log(err)
      })
    },

    // 초기에 초대된 이벤트가 있는지 표시
    getMyInvitation({commit}){
      console.log('이건 초대 이벤트 확인임')
      axiosConnector.get(`growth/invitation`
      ).then((res)=>{
        console.log(res.data)
        commit('GET_MY_INVITATION', res.data)
      }).catch((err)=>{
        console.log(err)
      })
    },

    // sidebar 열기
    openSidebar({commit}){
      commit('OPEN_SIDEBAR');
    },
    // sidebar 닫기
    closeSidebar({commit}){
      commit('CLOSE_SIDEBAR');
    },

  },

  modules: {
    temp: temp,
    growth: growth,
    timeline: timeline,
    search: search,
    job: job,
    tempJob: tempJob,
    statistics: statistics,
  },
});
