<template>
  <main>
    <div class="signup">
      <input type="email" v-model="dataSignup.email" placeholder="Email" required />
      <input type="text" v-model="dataSignup.prenom" placeholder="Prénom" required />
      <input type="text" v-model="dataSignup.nom" placeholder="Nom" required />
      <input type="password" v-model="dataSignup.password" placeholder="Mot de passe" required />
      <input type="file" name="image" @change="previewFile" />
     <button @click.prevent="signUp" type="submit">S'inscrire</button>
    </div>
     <router-view/>
  </main>
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
        previewFile(event) {
          console.log(event.target.files);
        },

        signUp() {
        axios.post("http://localhost:3000/api/auth/signup", {
          email: this.dataSignup.email,
          prenom: this.dataSignup.prenom,
          nom: this.dataSignup.nom,
          password: this.dataSignup.password,
        })
          .then(response => { console.log(response) })
          .catch(error => { console.log(error, error.response) })
      }
  }
}
</script>

