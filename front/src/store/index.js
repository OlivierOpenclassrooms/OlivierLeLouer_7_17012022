import { createStore } from 'vuex'


export default createStore({
  state: {
    user: {
      userId: '',
      token: '',
    },
    userInfos: {
      nom: '',
      prenom: '',
      email: '',
      biographie: '',
      photo: '',
    }
  },
  mutations: {

  },
  actions: {
    
  },
  modules: {
  }
})
