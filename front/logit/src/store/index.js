import { createStore } from "vuex";
import axios from "axios";
import router from "@/router";
import axiosConnector from "@/utils/axios-connector";
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

const baseURL = "http://localhost:9090/user";
export default createStore({

  state: {
    loginUser : {}
  },
  getters: {},
  mutations: {
    LOGIN_USER(state, payload) {
      console.log(payload);
      state.loginUser = payload
      console.log(state.loginUser);
      sessionStorage.setItem("token", payload["jwt-auth-token"]);
      sessionStorage.setItem("email", payload["user"]);
      router.push({ name: "MainPage" });
    },
    LOG_OUT(state) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");

      state.loginUser = {};
    },
    GET_USER(state, payload) {
      state.loginUser = payload;
      console.log(state.loginUser);
      router.push({ name: "ProfilePage" });
    },
  },
  actions: {
    // 유저 로그인
    login({ commit }, user) {
      const URL = `${baseURL}/login`;
      axios({
        url: URL,
        method: "POST",
        data: user,
      })
        .then((res) => {
          if (res.data.result == "사용자 없음") { 
            alert("사용자가 없습니다.")
            return
          }
          alert("로그인 성공했어 ~")
          console.log(res);
          commit("LOGIN_USER", res.data);
        })
        .catch((err) => {
          alert("으악!!!!!!! 로그인 실패");
          console.log(err);
        });
    },
    // 유저 회원가입하기
    signup({ dispatch }, user) {
      const URL = `${baseURL}/regist`;
      axios({
        url: URL,
        method: "POST",
        data: user,
      })
        .then(() => {
          alert("회원가입 성공했어 ~😚");
          dispatch("login", user);
          router.push({ name: "UserSignupComplete" });
        })
        .catch((err) => {
          alert("으악!!!!!!! 회원가입 실패");
          console.log(err);
        });
    },

    // signup({dispatch}, user) {
    //   axiosConnector
    //     .post("user/regist", user)
    //     .then(() => {
    //       alert("회원가입 성공했어 ~ ^^ ");
    //       dispatch("login", user);
    //       router.push({ name: "UserSignupComplete" });
    //     })
    //     .catch((err) => {
    //       alert("회원가입 실패했어 ~!!!");
    //       console.log(err);
    //     });
    // },

    // 유저 로그아웃하기
    logout({ commit }) {
      axiosConnector
        .post("user/logout")
        .then(() => {
          console.log("성공했어 ~크크큭 😋");
          commit("LOG_OUT");
        })
        .catch((err) => {
          alert("으악!!!!!!! 로그아웃 실패");
          console.log(err);
        });
    },
    // 비밀번호 변경하기 => 고쳐야함
    // updatePassword({ dispatch }, user) {
    //   axiosConnector
    //     .post("user", user)
    //     .then(() => {
    //       alert("정보 변경 성공했다구 ~~");
    //       dispatch("getUser");
    //     })
    //     .catch((err) => {
    //       alert("비.밀.번.호.변.경.실.패");
    //       console.log(err);
    //     });
    // },
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
    uploadImage({ dispatch }, file) {
      axiosConnector
        .post("user/uploadImage", file)
        .then((res) => { 
          console.log(res.data)
          alert("이미지 업로드 성공 했쓰어 ~~");
          dispatch("getUser");
        })
        .catch((err) => { 
          alert("이미지 업로드 실패했어..");
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
            console.log("사용자가 없습니다~(업데이트 실패)");
            return
          }       
            console.log(res.data)
            console.log("유저 정보 업데이트 성공해쓰어 ~");
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
          alert("사용자 정보 가져오기 성공이유 ~")
          commit("GET_USER", res.data);
        })
        .catch((err) => {
          alert("여기서 실패 헀스니다.");
          console.log(err);
        });
    },
  },

  modules: {
    // temp: temp,
    // event: event,
    // timeline: timeline,
  },
});
