<template>
    <main>
        <div class="container__title">
            <h1>Discussions :</h1>
        </div>
        <div class="card-create">
            <form class="card-create__form" @submit.prevent="createTopic">
                <input class="card-create__form__description" type='text' name="topic" placeholder="Nom du topic"/>
                <input type="submit" class="button-create" value="Créer"/>
            </form>
        </div>
        <div class="container__infos">
            <div class="card-infos" v-for="item in topic" :key="item">
                <div class="card-infos__title">
                    <p class="card-infos__title__name button-get" @click="getOneTopic" :topicId="item.id">{{ item.title }}</p>
                </div>
                <div class="card-infos__title" v-for="user in allUsers" :key="user">
                    <p class="card-infos__title__user" v-if="item.userId == user.id" @click="getOneUser" :userId="user.id">par {{ user.prenom }} {{ user.nom }}</p>
                    <div class="user-picture" v-if="item.userId == user.id">
                        <img v-if="user.imageUrl != null" :src="user.imageUrl"/>
                    </div>
                </div>
                <div class="card-infos__title">
                    <p class="card-infos__title__date">créé le {{ formatDate(item.createdAt) }}</p>
                    <p class="card-infos__title__date" v-if="item.updatedAt != item.createdAt">Edité le {{ formatDate(item.updatedAt) }}</p>
                </div>
                <div class="container-buttons" v-if="item.userId == user.id || user.isAdmin == true">
                    <form class="form-modify" @submit.prevent="modifyComment" :commentId="item.id">
                        <input class="form-modify__description" type='text' name="commentaire" placeholder="Entrer modification"/>
                        <input type="submit" class="button-comment" value="Modifier"/>
                    </form>
                    <button class='button-comment' @click="deleteComment" :commentId="item.id">Supprimer</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {
    
    name: 'texttopic',
    data() {
        return {
            dataTopic: {
                title: null,
                image: null,
                userId: this.$store.state.userInfos.id,
            },
            userToken: this.$store.state.userToken,
        }
    },

    mounted() {
        if (userInLocalStorage == null) {
            this.$router.push('/');
        } else {
            this.$store.dispatch('getUserToken');
            this.$store.dispatch('getAllTopics');
            this.$store.dispatch('getAllUsers');
            this.$store.dispatch('getAllComments');
            this.$store.dispatch('getUserInfos');
        }
    },

    computed: {
        ...mapState({allUsers: 'allUsersInfos'}),
        ...mapState({topic: 'topicInfos'}),
        ...mapState({user: 'userInfos'}),
        ...mapState({comment: 'commentInfos'}),
    },

    methods: {
        formatDate(bddDate) {
            const date = new Date(bddDate);
            const day = date.toLocaleDateString();
            const time = date.toLocaleTimeString();
            return `${day} à ${time}`
        },

        /*TOPIC CRUD*/

        createTopic(event) {
            const title = event.target.elements.topic.value;

            axios.post('http://localhost:3000/api/topic', {
                title: title,
                userId: this.dataTopic.userId,
                userIdOrder: this.dataTopic.userId,
            }, { 
                headers: {
                Authorization: "Bearer " + this.userToken
                }
            })
            .then( response => { console.log(response), this.$store.dispatch('getAllTopics')})
            .catch(error => {console.log(error)})
        },
        deleteTopic(event) {
            let topicId = event.target.getAttribute("topicId");

            axios.delete(`http://localhost:3000/api/topic/${topicId}`, { 
                headers: {
                Authorization: "Bearer " + this.userToken
                }, data: {
                    userIdOrder: this.dataTopic.userId,
                }
            })
            .then((response) => {
                console.log(response), this.$store.dispatch('getAllTopics')
            })
            .catch(error => 
                console.log(error)
            );
        },
        modifyTopic(event){
            const copy = Object.assign({}, this.dataEdit);

            for(const key in copy) {
                if (copy[key] == null) {
                delete copy[key]
                }
            }
            let topicId = event.target.getAttribute("topicId");

            axios.put(`http://localhost:3000/api/topic/${topicId}`, {
                title: this.dataTopic.title,
                description: this.dataTopic.description,
                userIdOrder: this.dataTopic.userId,
            }, { 
                headers: {
                Authorization: "Bearer " + this.userToken
                }
            })
            .then((response) => { console.log(response), this.$store.dispatch('getAllTopics') })
            .catch(error => console.log(error));
        },
        getOneTopic(event) {
            let topicId = event.target.getAttribute("topicId");

            axios.get(`http://localhost:3000/api/topic/${topicId}`, { 
                headers: {
                Authorization: "Bearer " + this.userToken
                } }
            )
            .then((response) => { console.log(response), this.$router.push(`/comment/${topicId}`) })
            .catch(error => console.log(error));
        },

        /*USER*/

        getOneUser(event) {
            let userId = event.target.getAttribute("userId");

            let userToken = userInLocalStorage.map(user => user.token);

            axios.get(`http://localhost:3000/api/auth/${userId}`, { 
                headers: {
                Authorization: "Bearer " + userToken
                } }
            )
            .then((response) => { console.log(response), this.$router.push(`/user/${userId}`) })
            .catch(error => console.log(error));
        },
    },
}
</script>

<style lang="scss" scoped>

.container {
    &__title {
        display: flex;
        width: 100%;
    }
    &__infos {
        display: flex;
        width: 100%;
        flex-direction: column;
    }
}

.card-infos {
    display:flex;
    flex-direction: column;
    border-bottom: #e6e6e6 solid 3px;
    padding: 2%;
    margin-top: 20px;
    position: relative;
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
        &__user {
            color: red;
            text-decoration: underline;
            font-weight: bolder;
            font-size: 14px;
            &:hover {
                cursor: pointer;
            }
        }
        &__date {
            font-style: italic;
            font-size: 12px;
        }
    }
}

.user-picture {
    img {
        height:100px;
        width: 100px;
        border-radius: 50%;
        object-fit: cover;  
        position: absolute;
        right: 40px;
        top: 0;
        bottom: 0;
        margin: auto;
    }
}

.container-buttons {
    justify-content: flex-start;
}

/*****************************/
/*VERSION MOBILE ET TABLETTE**/ 
/*****************************/

@media only screen and (max-width: 768px) {
    .user-picture {
        img {
            height: 75px;
            width: 75px;
        }
    }
}

</style>