<template>
    <main>
        <div class="container">
            <div v-for="i in topicInfos" :key="i">
                <h1>{{ i.title }}</h1>
            </div>
            <div class="card-infos" v-for="item in commentInfos" :key="item">
                <div v-for="allUsers in this.$store.state.allUsersInfos" :key="allUsers">
                    <div class="card-infos__user" v-if="item.userId == allUsers.id">
                        <div class="user">
                            <div v-if="item.image != null">
                                <p v-if="item.userId == allUsers.id">{{ allUsers.image }}</p>
                            </div>
                            <p class='button-get' :userId="item.userId" @click="getOneUser" v-if="item.userId == allUsers.id">{{ allUsers.prenom }} {{ allUsers.nom }}</p>
                        </div>
                    </div>
                </div>
                <div class="card-infos__content">
                    <p>{{ item.content }}</p>
                </div>
                <div class="card-infos__date">
                    <p>Posté le {{ item.createdAt }}</p>
                    <p v-if="item.updatedAt != item.createdAt">Edité le {{ item.updatedAt }}</p>
                </div>
                <div v-if="item.userId == this.$store.state.userInfos.id" class="container-buttons">
                    <p class='button-modify buttons' @click="modifyComment" :commentId="item.id">Modifier</p>
                    <p class='button-delete buttons' @click="deleteComment" :commentId="item.id">Supprimer</p>
                </div>
            </div>
            <div class="card-create">
                <textarea type="text" placeholder="Ecrivez votre réponse ici" v-model="commentData.content"></textarea>
                <p class="button-create" @click="createComment">Répondre</p>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

let userId = userInLocalStorage.map(user => user.userId);

let userToken = userInLocalStorage.map(user => user.token);

export default {
    name: 'Comment',
    data() {
        return {
            commentData: {
                content: null,
                userId: userId[0],
            }
        }
    },

    mounted() {
        let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
        this.$store.dispatch('getAllComments');
        this.$store.dispatch('getAllUsers');
        this.$store.dispatch('getUserInfos');
        this.$store.dispatch('getAllTopics');
        if (userInLocalStorage == null)
            this.$router.push('/')
    },
    computed: {
    ...mapState({user: 'userInfos'}),
    ...mapState({allUsers: 'allUsersInfos'}),
    ...mapState({topic: 'topicInfos'}),
    topicInfos() {
      return this.$store.state.topicInfos.filter(item => item.id == this.$route.params.id)
    },
    commentInfos() {
      return this.$store.state.commentInfos.filter(item => item.topicId == this.$route.params.id)
    },
  },
    methods: {
        createComment() {
            const topicId = this.$route.params.id;

            axios.post('http://localhost:3000/api/comment', {
                content: this.commentData.content,
                topicId: topicId,
                userId: this.commentData.userId
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
        })
            .then( response => { console.log(response), this.$router.go() })
            .catch(error => {console.log(error) })
        },
        modifyComment(){
            const copy = Object.assign({}, this.commentData);

            for(const key in copy) {
                if (copy[key] == null) {
                delete copy[key]
                }
            }

            let buttons = document.querySelectorAll('.button-modify');

            for (let button of Array.from(buttons)) {
                button.addEventListener("click", e => {

                    let commentId = e.target.getAttribute("commentId");

                    axios.put(`http://localhost:3000/api/comment/${commentId}`, {
                        content: this.commentData.content
                    }, { 
                        headers: {
                        Authorization: "Bearer " + userToken
                        }
                    })
                    .then((response) => { console.log(response), this.$router.go() })
                    .catch(error => console.log(error));
                })
            }
        },
        deleteComment() {
            let buttons = document.querySelectorAll('.button-delete');

            for (let button of Array.from(buttons)) {
                button.addEventListener("click", e => {
                    let commentId = e.target.getAttribute("commentId");

                    axios.delete(`http://localhost:3000/api/comment/${commentId}`,{ 
                        headers: {
                        Authorization: "Bearer " + userToken
                        }
                    })
                    .then((response) => {
                        console.log(response), this.$router.go()
                        })
                    .catch(error => console.log(error));
                })
            }
        },
        getOneUser() {
            let buttons = document.querySelectorAll('.button-get');

            for (let button of Array.from(buttons)) {
                button.addEventListener("click", e => {

                    let userId = e.target.getAttribute("userId");

                    axios.get(`http://localhost:3000/api/auth/${userId}`, { 
                        headers: {
                        Authorization: "Bearer " + userToken
                        } }
                    )
                    .then((response) => { console.log(response), this.$router.push(`/user/${userId}`) })
                    .catch(error => console.log(error));
                })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    &__infos {
        display: flex;
        flex-direction: column;
    }
}

.card-infos {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    border-radius: 5px;
    border: solid #f2f2f2 2px;
    padding: 2%;
    &__user {
        display: flex;
        flex-direction: row;
        border-bottom: solid 2px #f2f2f2;
    }
    p {
        margin-top: 0;
        margin-bottom: 10px;
    }
    &__content {
        display: flex;
        p {
            margin-top: 10px;
        }
    }
    &__date {
        display: flex;
        p {
        font-style: italic;
        font-size: 10px;
        }
    }
}

.card-create {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    textarea {
        width: 100%;
        text-decoration: none;
        margin-bottom: 10px;
    }
}

.container-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
        border-radius: 10px;
        font-weight: bold;
        color: white;
        height: 30px;
        width:15%;
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

.button-create {
    display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 10px;
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

.button-get {
    font-weight: bold;
    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>