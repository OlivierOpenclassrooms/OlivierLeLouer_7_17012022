<template>
  <main>
    <div>
        <input type="email" v-model="dataEdit.email" placeholder="Email" />
        <input type="text" v-model="dataEdit.prenom" placeholder="Prénom" />
        <input type="text" v-model="dataEdit.nom" placeholder="Nom" />
        <input type="text" v-model="dataEdit.biographie" placeholder="Biographie"/>
        <input type="text" v-model="dataEdit.poste" placeholder="Poste" />
        <input type="password" v-model="dataEdit.password" placeholder="Mot de passe" />
        <input type="file" placeholder="Met ta plus belle photo ici"/>
        <button @click="editUser">Modifier</button>
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
        password: null,
        biographie: null,
        poste: null,
        prenom: null,
      },
    }
  },
  methods: {
    editUser() {
      axios.put(`http://localhost:3000/api/auth/${userId}`, {
        poste: this.dataEdit.poste,
        password: this.dataEdit.password,

      }, { headers: {
          Authorization: "Bearer " + userToken
        } 
      })
      .then(response => { console.log(response)} )
      .catch(error => { console.log(error) })
    }
  },
};
</script>
