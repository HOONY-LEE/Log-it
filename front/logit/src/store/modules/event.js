import router from "@/router";
import axiosConnector from "@/utils/axios-connector";


const event = {
    namespaced: true,
    state:{
        events: [],
        event: {},
        eventUsers: [],
        progress: [],

    },
    getters: {
        // 이벤트 회원 수
        getEventUsersLength(state){
            return state.eventUsers.length;
        },
    },
    mutations: {
        CREATE_EVENT(context, payload){
            // state.event = payload
            // payload를 eventId로 할지, 등록한 event로 할지,,, 
            // 그냥 id만 반환해도 될듯 어차피 eventId로 getEvent할거니깡
            router.push({name: 'EventProgress', params: {eventId: payload.eventId}})
        },
        GET_EVENTS(state, payload){
            state.events = payload
        },
        GET_EVENT(state, payload){
            state.event = payload
        },
        GET_EVENT_USERS(state, payload){
            state.eventUsers = payload
        },
        GET_PROGRESS(state, payload){
            state.progress = payload
        }
    },
    actions: {
        // 성장 여정 추가
        createEvent({commit}, event){
            axiosConnector.post(`event`, event
            ).then((res)=>{
                commit('CREATE_EVENT', res.data)
            }).catch((err)=>{
                console.log(err)
            })
        },

        // 회원에 해당하는 모든 이벤트 가져오기
        getEvents({commit}, email) {
            const data = {
                email: email
            }
            axiosConnector.get(`event/get`, data
            ).then((res)=> {
                commit('GET_EVENTS', res.data)
            }).catch((err)=>{
                console.log(err)
            })
        },

        // test를 위해 앞에 {commit}을 지웠더니 payload가 안넘어오는 error 발생,,,,
        // 무조건 앞자리는 context, 두번째 자리가 payload의 자리라고 한다... 와우 넘 신기해
        // 관통때, mutation에서 값을 못 받아오는 이유가 이거였군... 신기

        // 이벤트 아이디에 해당하는 모든 이벤트 가져오기
        getEvent({commit}, eventId) {
            axiosConnector.get(`event/${eventId}`
            ).then((res)=>{
                commit('GET_EVENT', res.data)
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 이벤트 아이디에 해당하는 이벤트 참여 유저들 가져오기
        getEventUsers({commit}, eventId) {
            axiosConnector.get(`eventUser/${eventId}`
            ).then((res)=>{
                commit('GET_EVENT_USERS', res.data)
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 이벤트 아이디에 해당하는 과정들 가져오기
        getProgress({commit}, eventId) {
            axiosConnector.get(`progress/${eventId}`
            ).then((res)=>{
                commit('GET_PROGRESS', res.data)
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 이벤트에 회원 추가
        addEventUser({commit}, eventId, email){
            const data = {
                eventId: eventId,
                email: email
            }
            axiosConnector.post('eventUser', data
            ).then((res)=>{
                commit('ADD_EVENT_USER', res.data)
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 이벤트에 회원 삭제 ( 호스트만 가능 )
        deleteEventUser({dispatch}, eventId, email){
            const data = {
                eventId: eventId,
                email: email
            }
            axiosConnector.delete('eventUser', data
            ).then(()=>{
                dispatch('getEventUser', eventId)
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 이벤트에 과정 추가
        createProgress({dispatch}, progress){
            axiosConnector.post('progress', progress
            ).then((res)=>{
                // 이때 res.data는 eventId
                dispatch('getProgress', res.data);
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 이벤트에 과정 수정
        updateProgress({dispatch}, progress){
            axiosConnector.put('progress', progress
            ).then((res)=> {
                dispatch('getProgress', res.data)
            }).catch((err)=>{
                console.log(err);
            })
        }
        // 이벤트에 과정 삭제 => 그냥 안하면 어때,,, ? ㅋㅋㅋㅋ
    }

}

export default event;