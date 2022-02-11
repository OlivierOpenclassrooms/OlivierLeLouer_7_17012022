<template>
  <main>
    <div v-for="item in userInfos" :key="item">
      <div class="card-title">
        <h1 v-if="user.id == this.$route.params.id">Mon Profil</h1>
        <h1 v-else>Profil de {{ item.prenom }} {{ item.nom }}</h1>
        <p class= "card-title__button" v-if="this.$route.params.id == this.$store.state.userInfos.id" @click="this.$router.push('/editUser')">Modifier mon profil</p>
      </div>
      <div class="container-user">
        <div class="container-user__card">
          <img v-if="item.imageUrl != null" :src="item.imageUrl"/>
          <div class="container-user__card__name">
            <p>{{ item.prenom }} {{ item.nom }}</p>
          </div>
        </div>
        <div class="container-user__card__bio">
          <h2>A propos</h2>
          <h3>Poste</h3>
          <p>{{ item.poste }}</p>
          <h3>Biographie</h3>
          <p>{{ item.biographie }}</p>
          <span>Membre depuis le {{ item.createdAt }}</span>
        </div>
      </div>
    </div>
    <div class="container-contributions">
      <h2>Contributions</h2>
      <div class="card-infos" v-for="i in topicInfos" :key="i">
          <div class="card-infos__title">
            <p class="card-infos__title__name button-get" @click="getOneTopic" :topicId="i.id">{{ i.title }}</p>
          </div>
          <div class="card-infos__title">
              <p class="card-infos__title__date">créé le {{ i.createdAt }}</p>
              <p class="card-infos__title__date" v-if="i.updatedAt != i.createdAt">Edité le {{ i.updatedAt }}</p>
          </div>
      </div>
    </div>
    <router-view/>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {
  name: "User",
  mounted() {
        if (userInLocalStorage == null) {
          this.$router.push('/')
        } else {
          this.$store.dispatch('getUserInfos');
          this.$store.dispatch('getAllUsers');
          this.$store.dispatch('getAllTopics');
        }
  },
  computed: {
    ...mapState({user: 'userInfos'}),
    ...mapState({allUsers: 'allUsersInfos'}),
    ...mapState({topic: 'topicInfos'}),
    userInfos() {
      return this.$store.state.allUsersInfos.filter(item => item.id == this.$route.params.id)
    },
    topicInfos() {
      return this.$store.state.topicInfos.filter(item => item.userId == this.$route.params.id)
    },
  },
  methods: {
    getOneTopic(event) {
      let userToken = userInLocalStorage.map(user => user.token);
      
      let topicId = event.target.getAttribute("topicId");

      axios.get(`http://localhost:3000/api/topic/${topicId}`, { 
          headers: {
          Authorization: "Bearer " + userToken
          } }
      )
      .then((response) => { console.log(response), this.$router.push(`/comment/${topicId}`) })
      .catch(error => console.log(error));
    },
  }
}

</script>

<style lang="scss" scoped>
.card-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    border-radius: 10px;
    font-weight: bold;
    color: white;
    height: 40px;
    width:200px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 400ms;
    &:hover {
      cursor: pointer;
      filter: brightness(1.07);
      box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }

  }
}
.container-user {
  display: flex;
  flex-direction: column;
  &__card {
    display: flex;
    flex-direction: row;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin-bottom: 2%;
    align-items: center;
    padding: 2%;
    &__name {
      display: flex;
      flex-direction: row;
      font-weight: bold;
      font-size: 20px;
    }
    img {
      height:150px;
      width: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 20px;
    }
  }
  &__card__bio {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 2%;
    margin-bottom: 2%;
    span {
      margin-top: 2%;
      font-style: italic;
    }
  }
}

.container-contributions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 2%;
}

.card-infos {
    display:flex;
    flex-direction: column;
    border-bottom: #e6e6e6 solid 3px;
    padding: 2%;
    width: 96%;
    &__title {
        display: flex;
        border-right: #e6e6e6 solid 3px;
        flex-direction: row;
        p {
            margin: 1%;
            text-align: left;
        }
        &__name {
            font-weight: bolder;
            font-size: 20px;
            &:hover {
                text-decoration: underline;
                cursor: pointer;
            }
        }
        &__date {
            font-style: italic;
        }
    }
}
</style>
