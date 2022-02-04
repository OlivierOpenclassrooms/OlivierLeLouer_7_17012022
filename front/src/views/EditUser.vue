<template>
  <main>
    <div>
        <input type="email" v-model="dataEdit.email" placeholder="Email" />
        <input type="text" v-model="dataEdit.prenom" placeholder="Prénom" />
        <input type="text" v-model="dataEdit.nom" placeholder="Nom" />
        <input type="text" v-model="dataEdit.biographie" placeholder="Biographie"/>
        <input type="text" v-model="dataEdit.poste" placeholder="Poste" />
        <input type="password" v-model="changePassword.password" placeholder="Mot de passe" />
        <input type="file" placeholder="Met ta plus belle photo ici"/>
        <button @click="editUser">Modifier</button>
        <button @click="editPassword">Modifier le mot de passe</button>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
let userId = userInLocalStorage.map(user => user.userId || user.id);
let userToken = userInLocalStorage.map(user => user.token);


export default {
  name: "EditUser",
  data() {
    return {
      dataEdit: {
        nom: null,
        email: null,
        biographie: null,
        poste: null,
        prenom: null,
      },
      changePassword : {
        password: null,
      }
    }
  },
  mounted() {
        let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
        if (userInLocalStorage == null)
          this.$router.push('/')
  },
  methods: {
    editUser() {
      const copy = Object.assign({}, this.dataEdit);
      for(const key in copy) {
        if (copy[key] == null) {
          delete copy[key]
        }
      }

      axios.put(`http://localhost:3000/api/auth/${userId}`, {
        ...copy
      }, { headers: {
          Authorization: "Bearer " + userToken
        }
      })
      .then(response => { console.log(response) }
       )
      .catch(error => { console.log(error) })
    },
    editPassword() {
      axios.put(`http://localhost:3000/api/auth/password/${userId}`, {
        password: this.changePassword.password,
      }, { headers: {
          Authorization: "Bearer " + userToken
        }
      })
      .then(response => { console.log(response) }
       )
      .catch(error => { console.log(error) })
    }
  },
};
</script>
