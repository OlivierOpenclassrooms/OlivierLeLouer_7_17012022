import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: {
      userId: null,
      token: null,
    },
    userInfos: {
      id: null,
      nom: null,
      prenom: null,
      email: null,
      biographie: null,
      photo: null,
      poste: null,
    },
    topicInfos: []
  },
  mutations: {
    userInfos(state, userInfos) {
      state.userInfos = userInfos
    },
    topicInfos(state, topicInfos) {
      state.topicInfos = topicInfos
    }
  },
  actions: {
    getUserInfos() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
      let userId = userInLocalStorage.map(user => user.userId);
      let userToken = userInLocalStorage.map(user => user.token);
      axios.get(`http://localhost:3000/api/auth/${userId}`, {
        headers: {
            Authorization: "Bearer " + userToken
          }
        })
      .then(response => { this.commit('userInfos', response.data) })
      .catch(error => console.log(error));
    },
    getAllTopics() {
      axios.get('http://localhost:3000/api/topic')
        .then(response => { this.commit('topicInfos', response.data), console.log(response.data) 
        },  )
        .catch(error => { console.log(error)})
    },
    
  },
  modules: {
  }
})



