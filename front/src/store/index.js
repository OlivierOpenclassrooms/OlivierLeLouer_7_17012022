import { createStore } from 'vuex'

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default createStore({
  state: {
    status: '',
    user: {
      userId: '',
      token: '',
    },
    userInfos: {
      nom: '',
      prenom: '',
      email: '',
      image: '',
      biographie: '',
      poste: '',
    },
  },
  mutations: {

  },
  actions: {
  },
  modules: {
  }
})
