import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    allUsersInfos: [],
    userInfos: [],
    topicInfos: [],
    commentInfos: [],
  },
  mutations: {
    userInfos(state, userInfos) {
      state.userInfos = userInfos
    },
    allUsersInfos(state, allUsersInfos) {
      state.allUsersInfos = allUsersInfos
    },
    topicInfos(state, topicInfos) {
      state.topicInfos = topicInfos
    },
    commentInfos(state, commentInfos) {
      state.commentInfos = commentInfos
    },
  },
  actions: {
    getUserInfos() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      if (userInLocalStorage != null) {
        let userId = userInLocalStorage.map(user => user.userId);

        let userToken = userInLocalStorage.map(user => user.token);

        axios.get(`http://localhost:3000/api/auth/${userId}`, {
          headers: {
              Authorization: "Bearer " + userToken
            }
          })
        .then(response => { this.commit('userInfos', response.data), console.log(response.data) })
        .catch(error => console.log(error));
      }
    },
    getAllTopics() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

      axios.get('http://localhost:3000/api/topic', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => { this.commit('topicInfos', response.data), console.log(response.data) 
        })
        .catch(error => { console.log(error)})
    },
    getAllComments() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

      axios.get('http://localhost:3000/api/comment', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => { this.commit('commentInfos', response.data), console.log(response.data) 
        })
        .catch(error => { console.log(error)})
    },
    getAllUsers() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

      axios.get('http://localhost:3000/api/auth', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => { this.commit('allUsersInfos', response.data), console.log(response.data) 
        })
        .catch(error => { console.log(error)})
    },
  },
  modules: {
  }
})



