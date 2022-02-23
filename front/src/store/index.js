import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    userToken:[],
    allUsersInfos: [],
    userInfos: [],
    topicInfos: [],
    commentInfos: [],
    postInfos: [],
  },
  mutations: {
    userInfos(state, userInfos) {
      state.userInfos = userInfos
    },
    userToken(state, userToken) {
      state.userToken = userToken
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
    postInfos(state, postInfos) {
      state.postInfos = postInfos
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
        .then(response => { this.commit('userInfos', response.data) })
        .catch(error => console.log(error));
      }
    },
    getUserToken() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

        let userToken = userInLocalStorage.map(user => user.token);

        this.commit('userToken', userToken);

        console.log(userToken);
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
    getAllPosts() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

      axios.get('http://localhost:3000/api/post', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => { this.commit('postInfos', response.data), console.log(response.data) 
        })
        .catch(error => { console.log(error)})
    },
  },
  modules: {
  }
})



