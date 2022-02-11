<template>
    <main>
        <div class="container">
            <div class="container__title">
                <h1>Discussions :</h1>
            </div>
            <div class="card-create">
                <input type='text' v-model="dataTopic.title" placeholder="Nom du topic"/>
                <p class="button-create" @click="createTopic">Créer topic</p>
            </div>
            <div class="container__infos">
                <div class="card-infos" v-for="item in $store.state.topicInfos" :key="item">
                    <div class="card-infos__title">
                        <p class="card-infos__title__name button-get" @click="getOneTopic" :topicId="item.id">{{ item.title }}</p>
                    </div>
                    <div class="card-infos__title" v-for="user in $store.state.allUsersInfos" :key="user">
                        <p class="card-infos__title__user" v-if="item.userId == user.id">par {{ user.prenom }} {{ user.nom }}</p>
                        <div class="user-picture" v-if="item.userId == user.id">
                            <img v-if="user.imageUrl != null" :src="user.imageUrl"/>
                        </div>
                    </div>
                    <div class="card-infos__title">
                        <p class="card-infos__title__date">créé le {{ formatDate(item.createdAt) }}</p>
                        <p class="card-infos__title__date" v-if="item.updatedAt != item.createdAt">Edité le {{ item.updatedAt }}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
let userToken = userInLocalStorage.map(user => user.token);
let userId = userInLocalStorage.map(user => user.userId);

export default {
    
    name: 'texttopic',
    data() {
        return {
            dataTopic: {
                title: null,
                image: null,
                userId: userId[0],
            },
        }
    },

    mounted() {
        if (userInLocalStorage == null) {
            this.$router.push('/');
        } else {
            this.$store.dispatch('getAllTopics');
            this.$store.dispatch('getAllUsers');
            this.$store.dispatch('getAllComments');
        }
    },

    computed: {
        ...mapState({user: 'allUsersInfos'}),
        ...mapState({topic: 'topicInfos'}),
    },

    methods: {
        formatDate(date) {
            return new Date(date);
    },
        createTopic() {
            axios.post('http://localhost:3000/api/topic', {
                title: this.dataTopic.title,
                userId: this.dataTopic.userId
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then( response => { console.log(response), this.$router.go()})
            .catch(error => {console.log(error)})
        },
        deleteTopic(event) {
            let topicId = event.target.getAttribute("topicId");

            axios.delete(`http://localhost:3000/api/topic/${topicId}`,{ 
                headers: {
                Authorization: "Bearer " + userToken
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
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then((response) => { console.log(response), this.$router.go() })
            .catch(error => console.log(error));
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
    },
}
</script>

<style lang="scss" scoped>

.container {
    display: flex;
    flex-direction: column;
    &__title {
        display: flex;
    }
    &__infos {
        display: flex;
        flex-direction: column;
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
        }
        &__date {
            font-style: italic;
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

</style>