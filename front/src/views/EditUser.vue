<template>
  <main>
    <div class="title">
      <h1>Modifier le compte</h1>
      <p class="form__button delete-button" @click="deleteUser">Supprimer le compte</p>
    </div>
    <div class="container-edit">
      <div class="form-infos">
        <div class="picture">
          <label for="file" class="label-file">Choisir une image</label>
          <input class="input-file" ref="file" id="file" name="file" @change="selectFile" type="file"/>
          <p class="form__button" @click="editUserPicture">Modifier la photo de profil</p>
        </div>
        <div class="user">
          <input class="user__input-infos" type="email" v-model="dataEdit.email" placeholder='Entrer email'/>
          <input class="user__input-infos" type="text" v-model="dataEdit.prenom" placeholder='Entrer prénom'/>
          <input class="user__input-infos" type="text" v-model="dataEdit.nom" placeholder='Entrer nom' />
          <input class="user__input-infos" type="text" v-model="dataEdit.poste" placeholder="Poste"/>
          <textarea class="user__input-infos" type="text" v-model="dataEdit.biographie" placeholder="Biographie"></textarea>
          <p class="user__button" @click="editUser">Modifier les informations</p>
        </div>
      </div>
      <div class="form form-space">
        <input class="form__input" type="password" v-model="passwordCheck.password" placeholder="Nouveau mot de passe"/>
        <input class="form__input" type="password" v-model="dataEdit.password" placeholder="Saisissez une seconde fois le nouveau mot de passe"/>
        <p class="form__button" @click="editUserPassword">Modifier le mot de passe</p>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

import { mapState } from 'vuex';

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
        image: null,
        isAdmin: null,
        userIdOrder: this.$store.state.userInfos.id,
      },
      passwordCheck : {
        password: null,
      },
      userToken: this.$store.state.userToken[0],
    }
  },

  mounted() {
    let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

    if (userInLocalStorage == null) {
      this.$router.push('/');
    } else {
      this.$store.dispatch('getUserInfos');
      this.$store.dispatch('getUserToken');
    } 
  },

  computed: {
    ...mapState({ user: 'userInfos' })
  },

  methods: {
    selectFile(e) {
      this.dataEdit.image = e.target.files[0] || e.dataTransfer.files;
    },
    editUser() {
      const id = this.$route.params.id;
      const emailRegex = /^[^@&"/()!_$*€£`+=;?#]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

      const copy = Object.assign({}, this.dataEdit);
      for(const key in copy) {
        if (copy[key] == null) {
          delete copy[key]
        }
      }

      if(emailRegex.test(this.dataEdit.email) == true || this.dataEdit.email == null) {
        axios.put(`http://localhost:3000/api/auth/${id}`, {
          ...copy, 
          userIdOrder: this.dataEdit.userIdOrder
        }, { headers: {
            Authorization: "Bearer " + this.userToken
          } 
        })
        .then(response => {  
          console.log(response), 
          this.$store.dispatch('getUserInfos'); 
        })
        .catch(error => { console.log(error) })
      } else {
        alert('mauvais email')
      }
    },
    editUserPassword() {
      const id = this.$route.params.id;
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,30})$/;

      if(this.passwordCheck.password == this.dataEdit.password) {
        if (passwordRegex.test(this.dataLogin.password) == true) {

          axios.put(`http://localhost:3000/api/auth/${id}`, {
            password: this.dataEdit.password,
            userIdOrder: this.dataEdit.userIdOrder
            }, { 
              headers: {
              Authorization: "Bearer " + this.userToken
              } 
          })
          .then(response => {  
            console.log(response), 
            this.$store.dispatch('getUserInfos');
          })
          .catch(error => { console.log(error) })
        } else {
          alert('Pas le bon format de mdp')
        }

        } else {
          alert('Veuillez taper deux fois le même mot de passe !')
        }
      
    },
    editUserPicture() {
      const id = this.$route.params.id;

      const formData = new FormData();
      formData.append("image", this.dataEdit.image);
      formData.append("userIdOrder", this.dataEdit.userIdOrder);
      console.log("test récup", formData.get("image"));

      axios.put(`http://localhost:3000/api/auth/image/${id}`, formData,
        { headers: {
          Authorization: "Bearer " + this.userToken
        },
      })
      .then(response => {  
        console.log(response), 
        this.$store.dispatch('getUserInfos') 
      })
      .catch(error => { console.log(error) })
    },
    deleteUser() {
      const id = this.$route.params.id;

      axios.delete(`http://localhost:3000/api/auth/${id}`, { 
        headers: {
          Authorization: "Bearer " + this.userToken
        }, 
        data: {
          userIdOrder: this.dataEdit.userIdOrder,
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
.title {
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  h1 {
    text-align: left;
  }
}

.container-edit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-infos {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: #f2f2f2;
  padding: 5%;
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  
}

.picture {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  justify-content: center;
  label {
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
}

.user {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  justify-content: center;
  &__input-infos {
    width: 100%;
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
    width:100%;
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

.delete-button {
  width: 25%;
}

.form-space {
  margin-top: 30px;
}

/*****************************/
/*VERSION MOBILE ET TABLETTE*/ 
/*****************************/

@media only screen and (max-width: 768px) {
.picture {
  width: 100%;
  margin-bottom: 20px;
}

.user {
  width: 100%;
  &__button {
    width: 50%;
    font-size: 15px;
  }
}

.form {
  &__input {
    width: 100%;
  }
  &__button {
    font-size: 15px;
  }
}

}

</style>