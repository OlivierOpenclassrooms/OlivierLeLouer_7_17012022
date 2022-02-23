<template>
  <main>

    <!--USER INFOS-->

    <div v-for="item in userInfos" :key="item">
      <div class="card-title">
        <h1 v-if="user.id == this.$route.params.id">Mon Profil</h1>
        <h1 v-else>Profil de {{ item.prenom }} {{ item.nom }}</h1>
        <p class= "card-title__button" v-if="this.$route.params.id == user.id || user.isAdmin == true" @click="this.$router.push(`/editUser/${this.$route.params.id}`)">Modifier profil</p>
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
          <span>Membre depuis le {{ formatDate(item.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!--USER CONTIBUTIONS-->

    <div class="container-contributions">
      <h2>Discussions</h2>
      <div class="card-infos" v-for="i in topicInfos" :key="i">
          <div class="card-infos__title">
            <p class="card-infos__title__name button-get" @click="getOneTopic" :topicId="i.id">{{ i.title }}</p>
          </div>
          <div class="card-infos__title">
              <p class="card-infos__title__date">créé le {{ formatDate(i.createdAt) }}</p>
              <p class="card-infos__title__date" v-if="i.updatedAt != i.createdAt">Edité le {{ formatDate(i.updatedAt) }}</p>
          </div>
          <div class="container-buttons" v-if="i.userId == user.id || user.isAdmin == true">
              <input type='text' v-model="dataTopic.title"/>
              <p class='button-modify buttons' @click="modifyTopic" :topicId="i.id">Modifier</p>
              <p class='button-delete buttons' @click="deleteTopic" :topicId="i.id">Supprimer</p>
          </div>
      </div>
    </div>

    <!--USER WALL-->

    <div class="container">
      <h2>Mur</h2>
      <div class="card" v-for="item in postInfos" :key="item">
          <div class="card-post">
              <div v-for="allUsers in allUsers" :key="allUsers">
                  <div class="post__user" v-if="item.userId == allUsers.id">
                      <div class="user">
                          <div v-if="allUsers.imageUrl != null">
                              <img class="user__image" :src="allUsers.imageUrl"/>
                          </div>
                          <div class="user__description">
                              <p class='button-get user__description__name' :userId="item.userId" @click="getOneUser" v-if="allUsers.prenom != null">{{ allUsers.prenom }} {{ allUsers.nom }}</p>
                              <p class='user__description__create'>{{ formatDate(item.createdAt) }}</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="post">
                  <div class="post__description">
                      <p>{{ item.title }}</p>
                  </div>
                  <div class="post__picture">
                      <img v-if="item.imageUrl != null" :src="item.imageUrl"/>
                  </div>
              </div>
              <div class="create-comment">
                  <input type='text' v-model="commentData.content" placeholder="Ecrire un commentaire"/>
                  <p class="button-create" :postId="item.id" @click="createComment">Répondre</p>
              </div>
              <div v-if="item.userId == user.id || user.isAdmin == true" class="container-buttons">
                  <input type='text' v-model="dataPost.title"/>
                  <p class='button-modify buttons' @click="modifyPostDescription" :postId="item.id">Modifier description</p>
                  <input class="picture__input" ref="file" id="file" name="file" @change="selectFile" type="file"/>
                  <p class='button-modify buttons' @click="modifyPostPicture" :postId="item.id">Modifier image</p>
                  <p class='button-delete buttons' @click="deletePost" :postId="item.id">Supprimer</p>
              </div>
          </div>
          <div class="container-comment" v-for="i in comment" :key="i">
              <div v-if="item.id == i.postId">
                  <div class="card-comment" v-for="allUsers in allUsers" :key="allUsers">
                      <div class="card-comment__user" v-if="i.userId == allUsers.id">
                          <div v-if="allUsers.imageUrl != null">
                              <img class="user__image" :src="allUsers.imageUrl"/>
                          </div>
                          <div class="user-comment">
                              <p class='button-get user__description__name' :userId="i.userId" @click="getOneUser" v-if="allUsers.prenom != null">{{ allUsers.prenom }} {{ allUsers.nom }}</p>
                              <div class="card-infos__date">
                                  <p class='user__description__create'>Posté le {{ formatDate(i.createdAt) }}</p>
                                  <p class='user__description__create' v-if="i.updatedAt != i.createdAt">Edité le {{ formatDate(i.updatedAt) }}</p>
                              </div>
                              <div class="comment-content">
                                  <p>{{ i.content }}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
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

let userToken = userInLocalStorage.map(user => user.token);

let userId = userInLocalStorage.map(user => user.userId);

export default {
  name: "User",
   data() {
      return {
          dataTopic: {
            title: null,
            userId: userId[0],
          },
          commentData: {
            content: null,
          },
          dataPost: {
            title: null,
            image: null,
          },
        }
    },
  mounted() {
        if (userInLocalStorage == null) {
          this.$router.push('/')
        } else {
          this.$store.dispatch('getUserInfos');
          this.$store.dispatch('getAllComments');
          this.$store.dispatch('getAllUsers');
          this.$store.dispatch('getAllTopics');
          this.$store.dispatch('getAllPosts');
        }
  },
  computed: {
    ...mapState({user: 'userInfos'}),
    ...mapState({allUsers: 'allUsersInfos'}),
    ...mapState({topic: 'topicInfos'}),
    ...mapState({post: 'postInfos'}),
    ...mapState({comment: 'commentInfos'}),
    userInfos() {
      return this.$store.state.allUsersInfos.filter(item => item.id == this.$route.params.id)
    },
    postInfos() {
      return this.$store.state.postInfos.filter(item => item.userId == this.$route.params.id)
    },
    topicInfos() {
      return this.$store.state.topicInfos.filter(item => item.userId == this.$route.params.id)
    },
  },
  methods: {
    formatDate(e) {
            const date = new Date(e);
            const day = date.toLocaleDateString();
            return day
        },
    getOneTopic(event) {
      let topicId = event.target.getAttribute("topicId");

      axios.get(`http://localhost:3000/api/topic/${topicId}`, { 
          headers: {
          Authorization: "Bearer " + userToken
          } }
      )
      .then((response) => { console.log(response), this.$router.push(`/comment/${topicId}`) })
      .catch(error => console.log(error));
    },
    deleteTopic(event) {
      let topicId = event.target.getAttribute("topicId");

      axios.delete(`http://localhost:3000/api/topic/${topicId}`, { 
          headers: {
          Authorization: "Bearer " + userToken
          }, data: {
              userIdOrder: this.dataTopic.userId,
          }
      })
      .then((response) => {
          console.log(response), this.$router.go()
      })
      .catch(error => 
          console.log(error)
      );
    },
    modifyTopic(event){
      let topicId = event.target.getAttribute("topicId");

      axios.put(`http://localhost:3000/api/topic/${topicId}`, {
          title: this.dataTopic.title,
          userIdOrder: this.dataTopic.userId,
      }, { 
          headers: {
          Authorization: "Bearer " + userToken[0]
          }
      })
      .then((response) => { console.log(response), this.$router.go() })
      .catch(error => console.log(error));
    },
  }
}
</script>

<style lang="scss" scoped>

/*****************************/
/**********USER***************/
/****************************/

.card-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  h1 {
    text-align: left;
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

/*****************************/
/******CONTRIBUTIONS**********/
/****************************/

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

/*******************/
/******WALL*********/
/*******************/

.container {
    display: flex;
    flex-direction: column;
    &__title {
        display: flex;
    }
}

.card-create {
    display: flex;
    flex-direction: row;
    input {
        width: 80%;
        border-radius: 10px 0px 0px 10px;
    }
}

.button-create {
    display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 0px 10px 10px 0px;
      font-weight: bold;
      color: white;
      height: 40px;
      width:20%;
      margin: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 400ms;
      &:hover {
        cursor: pointer;
        filter: brightness(1.07);
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }
}

/* POST & COMMENT */

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80%;
    padding: 2%;
    margin-bottom: 30px;
    border: solid 2px #f2f2f2;
    border-radius: 10px;
    margin-top: 20px;
}

/* POST */

.card-post {
    display: flex;
    flex-direction: column;
    min-width: 100%;
}

.user {
    display:flex;
    flex-direction: row;
    align-items: center;
    min-width: 100%;
    padding-left: 2%;
    padding-top: 2%;
    &__image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 20px;
    }
    &__description {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            margin: 0;
            margin-bottom: 5px;
        }
        &__name {
            font-weight: bolder;
            &:hover {
                text-decoration: underline;
                cursor: pointer;
            }
        }
        &__create {
            font-style: italic;
            font-size: 10px;
        }
    }
}

.post {
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-width: 100%;
    &__description {
        display: flex;
        align-items: flex-start;
        padding-left: 2%;
    }
    &__picture {
        display: flex;
        width: 100%;
        border-top: solid 2px #f2f2f2;
        border-bottom: solid 2px #f2f2f2;
        margin-bottom: 10px;
        align-content: center;
        justify-content: center;
        img {
            display: flex;
            object-fit: contain;
            max-width: 100%;
        }
    }
}

.create-comment {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
    input {
        width: 75%;
        border-radius: 10px 0px 0px 10px;
    }
}

/* COMMENT */
.container-comment {
    width: 100%;
}

.card-comment {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 1px;
}
.card-comment__user {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.user-comment {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #f2f2f2;
    border-radius: 10px;
    padding: 10px;
    p {
        margin: 0;
    }
}

.comment-content {
    display: flex;
    margin-top: 5px;
    flex-direction: row;
    p {
        text-align: left;
    }
}

</style>
