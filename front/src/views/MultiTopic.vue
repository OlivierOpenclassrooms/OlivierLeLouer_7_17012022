<template>
    <main>
        <div class="container">
            <div class="container__topic">
                PLUS TARD
            </div>
            <div class="container__comment">
            </div>
        </div>
        </main>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

let userToken = userInLocalStorage.map(user => user.token);

let userId = userInLocalStorage.map(user => user.userId);

export default {

name: 'multitopic',
    data() {
        return {
            commentData: {
                content: null,
                userId: userId[0],
            },
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

        /*FUNCTIONS COMMENT*/

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
        modifyComment(event){
            const copy = Object.assign({}, this.commentData);

            for(const key in copy) {
                if (copy[key] == null) {
                delete copy[key]
                }
            }
            let commentId = event.target.getAttribute("commentId");

            axios.put(`http://localhost:3000/api/comment/${commentId}`, {
                content: this.commentData.content
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then((response) => { console.log(response), this.$router.go() })
            .catch(error => console.log(error));
        },
        deleteComment(event) {
            let commentId = event.target.getAttribute("commentId");

            axios.delete(`http://localhost:3000/api/comment/${commentId}`,{ 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then((response) => {
                console.log(response), this.$router.go()
                })
            .catch(error => console.log(error));
        },

        /*FUNCTIONS USER*/

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

        /*FUNCTIONS TOPIC*/

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
    }
}

</script>

<style lang="scss" scoped>

</style>
