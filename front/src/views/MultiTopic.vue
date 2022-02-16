<template>
    <main>
        <div class="container">
            <div class="container__title">
                <h1>Mur :</h1>
            </div>
            <div class="card-create">
                <input type='text' v-model="dataPost.title" placeholder="Description"/>
                <input class="picture__input" ref="file" id="file" name="file" @change="selectFile" type="file"/>
                <p class="button-create" @click="createPost">Poster</p>
            </div>
            <div class="card" v-for="item in post" :key="item">
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
            dataPost: {
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
            this.$store.dispatch('getAllPosts');
        }   
    },
    computed: {
    ...mapState({user: 'userInfos'}),
    ...mapState({allUsers: 'allUsersInfos'}),
    ...mapState({post: 'postInfos'}),
    ...mapState({comment: 'commentInfos'}),
  },
    methods: {
        formatDate(e) {
            const date = new Date(e);
            const day = date.toLocaleDateString();
            const time = date.toLocaleTimeString();
            return `${day} à ${time}`
        },
        /*FUNCTIONS COMMENT*/

        createComment(event) {
            const postId = event.target.getAttribute("postId");
            console.log(postId)
            
            axios.post('http://localhost:3000/api/comment', {
                content: this.commentData.content,
                postId: postId,
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
            let commentId = event.target.getAttribute("commentId");

            axios.put(`http://localhost:3000/api/comment/${commentId}`, {
                content: this.commentData.content,
                userIdOrder: this.commentData.userId
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
                }, data: {
                    userIdOrder: this.commentData.userId
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

        /*FUNCTIONS POST*/

        selectFile(e) {
            this.dataPost.image = e.target.files[0] || e.dataTransfer.files;
        },

        createPost() {
            const formData = new FormData();
            formData.append("image", this.dataPost.image);
            formData.append("title", this.dataPost.title);
            formData.append("userId", this.dataPost.userId);
            console.log("test récup", formData.get("image"));

            axios.post('http://localhost:3000/api/post', formData, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then( response => { console.log(response), this.$router.go()})
            .catch(error => {console.log(error)})
        },
        deletePost(event) {
            let postId = event.target.getAttribute("postId");

            axios.delete(`http://localhost:3000/api/post/${postId}`,{ 
                headers: {
                Authorization: "Bearer " + userToken
                }, data: {
                    userIdOrder: this.dataPost.userId,
                },
            })
            .then((response) => {
                console.log(response), this.$router.go()
            })
            .catch(error => 
                console.log(error)
            );
        },
        modifyPostDescription(event){
            let postId = event.target.getAttribute("postId");

            axios.put(`http://localhost:3000/api/post/${postId}`, {
                title: this.dataPost.title,
                userIdOrder: this.dataPost.userId,
            }, { 
                headers: {
                Authorization: "Bearer " + userToken
                }
            })
            .then((response) => { console.log(response), this.$router.go() })
            .catch(error => console.log(error));
        },
        modifyPostPicture(event) {
            let postId = event.target.getAttribute("postId");

            const formData = new FormData();
            formData.append("image", this.dataPost.image);
            formData.append("userIdOrder", this.dataPost.userId);
            console.log("test récup", formData.get("image"));

            axios.put(`http://localhost:3000/api/post/image/${postId}`, formData,
            { headers: {
                Authorization: "Bearer " + userToken
                },
            })
            .then(response => {  
                console.log(response), 
                this.$router.go() 
            })
            .catch(error => { console.log(error) })
        },
    }
}

</script>

<style lang="scss" scoped>

/*EN TETE PAGE*/

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
