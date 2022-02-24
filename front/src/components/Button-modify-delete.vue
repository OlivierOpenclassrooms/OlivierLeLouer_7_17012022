<template>
    <main>
        <div>
            HELLO
        </div>
        <input type='text' v-model="dataTopic.title" placeholder="Titre"/>
        <input type='text' v-model="dataTopic.description" placeholder="Description"/>
        <button @click="createTopic">Créer topic</button>
    </main>
</template>

<script>
import axios from 'axios'
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
            }
        }
    },
    computed: {
        ...mapState({user: 'userInfos'})
    },
    methods: {
        createTopic() {
            axios.post('http://localhost:3000/api/topic', {
                title: this.dataTopic.title,
                description: this.dataTopic.description,
                userId: this.dataTopic.userId
            })
            .then( response => { console.log(response)})
            .catch(error => {console.log(error)})
        }
    },
}
</script>