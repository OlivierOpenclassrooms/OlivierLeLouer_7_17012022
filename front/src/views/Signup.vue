<template>
    <div class="about">
      <label>email</label>
      <input type="email" v-model="dataSignup.email" required />
    </div>
    <div class="about">
      <label>prenom</label>
      <input type="text" v-model="dataSignup.prenom" required />
    </div>
    <div class="about">
      <label>nom</label>
      <input type="text" v-model="dataSignup.nom" required />
    </div>
    <div class="about">
      <label>password</label>
      <input type="password" v-model="dataSignup.password" required />
    </div>
     <button @click.prevent="signUp" type="submit">S'inscrire</button>
     <router-view/>
</template>

<script>
import axios from 'axios'

export default {
  name: "SignUp",
  data() {
    return {
      dataSignup: {
        nom: null,
        email: null,
        password: null,
        prenom: null
      },
    }
  }, 
  methods: {
        signUp() {
        axios.post("http://localhost:3000/api/auth/signup", {
          email: this.dataSignup.email,
          prenom: this.dataSignup.prenom,
          nom: this.dataSignup.nom,
          password: this.dataSignup.password,
        })
          .then(response => {
            console.log(response)
          })
          .catch(error => {console.log(error, error.response)})
      }
  }
}
</script>

