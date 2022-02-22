<template>
    <main>
        <div class="container">
            <div v-for="i in topicInfos" :key="i">
                <h1>{{ i.title }}</h1>
            </div>
            <div class="card-infos" v-for="item in commentInfos" :key="item">
                <div v-for="allUsers in allUsers" :key="allUsers">
                    <div class="card-infos__user" v-if="item.userId == allUsers.id">
                        <div class="user">
                            <div v-if="allUsers.imageUrl != null">
                                <img class="user__image" :src="allUsers.imageUrl"/>
                            </div>
                            <p class='button-get' :userId="item.userId" @click="getOneUser" v-if="allUsers.prenom != null">{{ allUsers.prenom }} {{ allUsers.nom }}</p>
                        </div>
                    </div>
                </div>
                <div class="card-infos__content">
                    <p>{{ item.content }}</p>
                </div>
                <div class="card-infos__date">
                    <p>Posté le {{ formatDate(item.createdAt) }}</p>
                    <p v-if="item.updatedAt != item.createdAt">Edité le {{ formatDate(item.updatedAt) }}</p>
                </div>
                <div v-if="item.userId == user.id || user.isAdmin == true" class="container-buttons">
                    <form class="form-modify" @submit.prevent="modifyComment" :commentId="item.id">
                        <input class="form-modify__description" type='text' name="commentaire" placeholder="Entrer modification"/>
                        <input type="submit" class="button-comment" value="Modifier"/>
                    </form>
                    <button class='button-comment' @click="deleteComment" :commentId="item.id">Supprimer</button>
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
        
        if (userInLocalStorage == null) {
            this.$router.push('/')
        } else {
            this.$store.dispatch('getAllComments');
            this.$store.dispatch('getAllUsers');
            this.$store.dispatch('getUserInfos');
            this.$store.dispatch('getAllTopics');
        }
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
        formatDate(e) {
            const date = new Date(e);
            const day = date.toLocaleDateString();
            const time = date.toLocaleTimeString();
            return `${day} à ${time}`
        },
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
            .then( response => { console.log(response), this.$store.dispatch('getAllComments') })
            .catch(error => {console.log(error) })
        },
        modifyComment(event){
            let commentId = event.target.getAttribute("commentId");
            const content = event.target.elements.commentaire.value;

            axios.put(`http://localhost:3000/api/comment/${commentId}`, {
                content: content,
                userIdOrder: this.commentData.userId
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then((response) => { console.log(response), this.$store.dispatch('getAllComments') })
            .catch(error => console.log(error));
        },
        deleteComment(event) {
            let commentId = event.target.getAttribute("commentId");

            axios.delete(`http://localhost:3000/api/comment/${commentId}`, { 
                headers: {
                Authorization: "Bearer " + userToken
                }, data: {
                    userIdOrder: this.commentData.userId,
                }
            })
            .then((response) => { console.log(response), this.$store.dispatch('getAllComments') })
            .catch(error => console.log(error));
        },
        getOneUser(event) {
            let userId = event.target.getAttribute("userId");

            axios.get(`http://localhost:3000/api/auth/${userId}`, { 
                headers: {
                Authorization: "Bearer " + userToken
                } }
            )
            .then((response) => { console.log(response), this.$router.push(`/user/${userId}`) })
            .catch(error => console.log(error));
        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 95%;
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
        margin-right: 10px;
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

.button-get {
    font-weight: bold;
    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}

.user {
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    &__image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 20px;
    }
}
</style>