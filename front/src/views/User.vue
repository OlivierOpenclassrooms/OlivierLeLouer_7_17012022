<template>
  <main>
    <div class="container-user">
      <div class="container-user__card">
        <p v-if="user.image != null">{{ user.image }}</p>
        <div class="container-user__card__name">
          <p>{{ user.prenom }} {{ user.nom }}</p>
        </div>
      </div>
      <div class="container-user__card__bio">
        <h3>Poste</h3>
        <p>{{ user.poste }}</p>
        <h3>Biographie</h3>
        <p>{{ user.biographie }}</p>
        <span>Membre depuis le {{ user.createdAt }}</span>
      </div>
      <div class="container-button">
        <p class= "container-button__button" @click="this.$router.push('/editUser')">Modifier mon profil</p>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "User",

  mounted() {
        this.$store.dispatch('getUserInfos');
        this.$store.dispatch('getAllUsers');
        let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
        if (userInLocalStorage == null)
          this.$router.push('/')
  },
  computed: {
    ...mapState({user: 'userInfos'}),
    ...mapState({allUsers: 'allUsersInfos'}),
  },
}

</script>

<style lang="scss" scoped>

.container-user {
  display: flex;
  flex-direction: column;
  margin-top: 10%;
  &__card {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-bottom: 2%;
    &__name {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    p {
      display: flex;
    }
  }
  &__card__bio {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    padding: 2%;
    margin-bottom: 2%;
    span {
      margin-top: 2%;
      font-style: italic;
    }
  }
  .container-button {
    display: flex;
    justify-content: center;
    align-items: center;
    &__button {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 10px;
      font-weight: bold;
      color: white;
      height: 50px;
      width:230px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 400ms;
      &:hover {
        cursor: pointer;
        filter: brightness(1.07);
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }
    }
  }
}

</style>
