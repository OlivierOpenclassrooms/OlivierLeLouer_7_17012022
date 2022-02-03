<template>
  <main>
    <div>
      <button @click="deleteUser">Supprimer mon compte</button>
    </div>
    <router-link to="/edituser">Modifier son profil</router-link>
  </main>
</template>

<script>
import axios from "axios";

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
let userId = userInLocalStorage.map(user => user.userId || user.id);
let userToken = userInLocalStorage.map(user => user.token);

export default {
  name: "User",
  data() {
    return {
      
    }
  },
  methods: {
    deleteUser() {
      axios.delete(`http://localhost:3000/api/auth/${userId}`, {
        headers: {
            Authorization: "Bearer " + userToken
          }
        })
        .then(() => {
          localStorage.clear();
          this.$router.push('/');
        })
        .catch(error => console.log(error));
    },
  }
}

</script>
