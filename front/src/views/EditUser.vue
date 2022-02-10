<template>
  <main>
    <h1>Modifier mon compte</h1>
    <div class="container-edit">
      <div class="form">
        <input class="form__input" type="email" v-model="dataEdit.email" :placeholder="user.email" />
        <input class="form__input" type="text" v-model="dataEdit.prenom" :placeholder="user.prenom" />
        <input class="form__input" type="text" v-model="dataEdit.nom" :placeholder="user.nom" />
        <input class="form__input" type="text" v-model="dataEdit.poste" placeholder="Poste" />
        <input class="form__input" type="file" placeholder="Met ta plus belle photo ici"/>
        <textarea class="form__input" type="text" v-model="dataEdit.biographie" placeholder="Biographie"></textarea>
        <p class="form__button" @click="editUser">Modifier mes informations</p>
      </div>
      <div class="form form-space">
        <input class="form__input" type="password" v-model="changePassword.password" placeholder="Nouveau mot de passe" />
        <input class="form__input" type="password" v-model="changePassword.password" placeholder="Saisissez une seconde fois le nouveau mot de passe"/>
        <p class="form__button" @click="editUser">Modifier mon mot de passe</p>
      </div>
      <div class="form form-space">
        <input class="form__input" type="password" v-model="deletePassword.password" placeholder="Vérification du mot de passe" required/>
        <p class="form__button" @click="deleteUser">Supprimer mon compte</p>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

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
        password: null,
      },
      deletePassword : {
        password: null,
      }
    }
  },

  mounted() {

    if (userInLocalStorage == null) {
      this.$router.push('/')
    }
    this.$store.dispatch('getUserInfos');
  },

  computed: {
    ...mapState({user: 'userInfos'})
  },

  methods: {
    editUser() {
      let userId = userInLocalStorage.map(user => user.userId || user.id);

      let userToken = userInLocalStorage.map(user => user.token);

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
        } }
      )
      .then(response => { console.log(response), this.$router.go() })
      .catch(error => { console.log(error) })
    },
    deleteUser() {
      let userId = userInLocalStorage.map(user => user.userId || user.id);

      let userToken = userInLocalStorage.map(user => user.token);

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
  },
};
</script>

<style lang="scss" scoped>

.container-edit {
  display: flex;
  flex-direction: column;
}
.form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  
  background-color: #f2f2f2;
  padding: 5%;
  border-radius: 10px;
  &__input  {
    width:50%;
    margin-bottom: 20px;
  }
  &__button {
    display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 10px;
      font-weight: bold;
      color: white;
      height: 40px;
      width:50%;
      margin: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 400ms;
      &:hover {
        cursor: pointer;
        filter: brightness(1.07);
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }
  }
}

.form-space {
  margin-top: 30px;
}

</style>
