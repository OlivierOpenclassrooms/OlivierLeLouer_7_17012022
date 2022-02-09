<template>
    <header>
        <div class="header">
            <div class="header__icon">
                <img src="../assets/icon.svg" alt="Logo de Groupomania">
                <p>Groupomania</p>
            </div>
            <div class="nav">
                <div class="nav__card" @click="this.$router.push('/texttopic')">
                    <i class="far fa-comments"></i>
                    <p>Discussions</p>
                </div>
                <div class="nav__card" @click="this.$router.push('/multitopic')">
                    <i class="fas fa-tablet-alt"></i>
                    <p>Multimédia</p>
                </div>
                <div class="nav__card" @click="getOneUser">
                    <i class="fas fa-user"></i>
                    <p>Mon compte</p>
                </div>
                <div class="nav__card" @click="deconnectUser">
                    <i class="fas fa-door-open"></i>
                    <p>Deconnexion</p>
                </div>
            </div>
        </div>
  </header>
</template>

<script>
import axios from 'axios'

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
let userToken = userInLocalStorage.map(user => user.token);
let userId = userInLocalStorage.map(user => user.userId);

export default {
    name: "Header",

    data() {
        return {
            mode: 'logout',
        }
    },
    methods : {
        deconnectUser() {
            localStorage.clear();
            this.$router.push('/');
        },
        getOneUser() {
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

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 1024px;
    margin: auto;
    align-items: center;
    flex-wrap: wrap;
    &__icon {
        width: 350px;
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
            max-height: 100px;
            width: auto;
        }
        p {
            font-size: 40px;
            color: red;
        }
    }
}

.nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    min-width: 50%;
    &__card {
        display: flex;
        flex-direction: column;
        width: 20%;
        &:hover {
            color: red;
            cursor: pointer;
        }
    }
}

</style>
