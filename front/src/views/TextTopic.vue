<template>
    <main>
        <div v-for="item in $store.state.topicInfos" :key="item">
                <p>{{ item.title }}</p>
                <p>{{ item.description }}</p>
                <button class="button-delete" @click="deleteTopic" :topicId="item.id">Supprimer</button>
                <button class="button-modify" @click="modifyTopic" :topicId="item.id">Modifier</button>
                <button class="button-get" @click="getOneTopic" :topicId="item.id">ALLER ICI</button>
        </div>
        <input type='text' v-model="dataTopic.title" placeholder="Titre"/>
        <input type='text' v-model="dataTopic.description" placeholder="Description"/>
        <button @click="createTopic">Créer topic</button>
    </main>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
let userId = userInLocalStorage.map(user => user.userId);

export default {
    
    name: 'texttopic',
    data() {
        return {
            dataTopic: {
                title: null,
                description: null,
                image: null,
                userId: userId[0],
            },
        }
    },

    mounted() {
        this.$store.dispatch('getAllTopics');
    },

    computed: {
        ...mapState({user: 'userInfos'}),
        ...mapState({topic: 'topicInfos'}),
    },

    methods: {
        createTopic() {
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            let userToken = userInLocalStorage.map(user => user.token);

            axios.post('http://localhost:3000/api/topic', {
                title: this.dataTopic.title,
                description: this.dataTopic.description,
                userId: this.dataTopic.userId
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then( response => { console.log(response)})
            .catch(error => {console.log(error)})
        },
        deleteTopic() {
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            let userToken = userInLocalStorage.map(user => user.token);

            let buttons = document.querySelectorAll('.button-delete');

            for (let button of Array.from(buttons)) {
                button.addEventListener("click", e => {

                    let topicId = e.target.getAttribute("topicId");

                    axios.delete(`http://localhost:3000/api/topic/${topicId}`,{ 
                        headers: {
                        Authorization: "Bearer " + userToken
                        }
                    })
                    .then((response) => {
                        console.log(response)
                    })
                    .catch(error => 
                        console.log(error)
                    );
                })
            }
        },
        modifyTopic(){
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            let userToken = userInLocalStorage.map(user => user.token);

            const copy = Object.assign({}, this.dataEdit);

            for(const key in copy) {
                if (copy[key] == null) {
                delete copy[key]
                }
            }

            let buttons = document.querySelectorAll('.button-modify');

            for (let button of Array.from(buttons)) {
                button.addEventListener("click", e => {

                    let topicId = e.target.getAttribute("topicId");

                    axios.put(`http://localhost:3000/api/topic/${topicId}`, {
                        title: this.dataTopic.title,
                        description: this.dataTopic.description,
                    }, { 
                        headers: {
                        Authorization: "Bearer " + userToken
                        }
                    })
                    .then((response) => { console.log(response) })
                    .catch(error => console.log(error));
                })
            }
        },
        getOneTopic() {
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            let userToken = userInLocalStorage.map(user => user.token);

            let buttons = document.querySelectorAll('.button-get');

            for (let button of Array.from(buttons)) {
                button.addEventListener("click", e => {

                    let topicId = e.target.getAttribute("topicId");

                    axios.get(`http://localhost:3000/api/topic/${topicId}`, { 
                        headers: {
                        Authorization: "Bearer " + userToken
                        } }
                    )
                    .then((response) => { console.log(response), this.$router.push(`/comment/${topicId}`) })
                    .catch(error => console.log(error));
                })
            }
        }
    },
}
</script>