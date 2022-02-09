<template>
    <main>
        <div>
            <input type="text" placeholder="Ecrire ici" v-model="commentData.content"/>
            <button @click="createComment">Poster</button>
        </div>
        <div v-for="item in $store.state.commentInfos" :key="item">
            <div v-if="item.topicId == this.$route.params.id">
                <div v-for="user in $store.state.userInfos" :key="user">
                    <p v-if="item.userId == user.id">{{ user.nom }}</p>
                    <p v-if="item.userId == user.id">{{ user.prenom }}</p>
                </div>
                <p>{{ item.content }}</p>
                <button v-if="item.topicId == this.$route.params.id" class='button-modify' @click="modifyComment" :commentId="item.id">Modifier</button>
                <button  class='button-delete' @click="deleteComment" :commentId="item.id">Supprimer</button>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios'

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

let userId = userInLocalStorage.map(user => user.userId);

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
        
        if (userInLocalStorage == null)
            this.$router.push('/')
    },
    methods: {
        createComment() {
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
            
            let userToken = userInLocalStorage.map(user => user.token);

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
            .then( response => { console.log(response) })
            .catch(error => {console.log(error) })
        },
        modifyComment(){
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            let userToken = userInLocalStorage.map(user => user.token);

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
                    .then((response) => { console.log(response) })
                    .catch(error => console.log(error));
                })
            }
        },
        deleteComment() {
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            let userToken = userInLocalStorage.map(user => user.token);

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
                        console.log(response)
                        })
                    .catch(error => console.log(error));
                })
            }
        },
    }
}
</script>

<style lang="scss" scoped>

</style>