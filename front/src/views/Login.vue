<template>
    <main>
        <div class='card'>
            <h1 class='card__title' v-if ="mode == 'login'">Connexion</h1>
            <h1 class='card__title' v-else>Inscription</h1>
            <div class= 'form'>
                <input type="email" v-model="dataLogin.email" placeholder="Email" required/>
                <input type="password" v-model="dataLogin.password" placeholder="Mot de passe" required/>
            </div>
            <div class= 'form' v-if='mode=="signUp"'>
                <input type="text" v-model="dataLogin.prenom" placeholder="Prénom" required />
                <input type="text" v-model="dataLogin.nom" placeholder="Nom" required />
            </div>
            <button @click.prevent="login" v-if="mode == 'login'">S'identifier</button>
            <button @click.prevent="signUp" v-else>S'inscrire</button>
            <p v-if="mode == 'signUp'">Déjà inscrit ? <span class= 'card__action' @click="switchToLogin">Se connecter</span></p>
            <p v-else>Pas encore inscrit ? <span class= 'card__action' @click="switchToSignUp">S'inscrire</span></p>
        </div>
    </main>
</template>

<script>
import axios from "axios";

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {
    name: "Login",
    data () {
        return {
            dataLogin: {
                email: null,
                nom: null,
                prenom: null,
                password: null,
            },
            mode: 'login'
        }
    },
    mounted() {
        if (userInLocalStorage != null) {
            this.$router.push('/topic');
        }
    },

    methods: {
        switchToSignUp() {
            this.mode ='signUp'
        },
        switchToLogin() {
            this.mode ='login'
        },
        saveUserInLocalStorage(response) {
            if (userInLocalStorage === null) {
                userInLocalStorage = [];
                userInLocalStorage.push(response);
                localStorage.setItem('user', JSON.stringify(userInLocalStorage));
            } else {
                localStorage.clear();
                userInLocalStorage = [];
                userInLocalStorage.push(response);
                localStorage.setItem('user', JSON.stringify(userInLocalStorage));
            }
        },
        login () {
            axios.post("http://localhost:3000/api/auth/login", {
                email: this.dataLogin.email,
                password: this.dataLogin.password,
            })
            .then(response => { 
                this.saveUserInLocalStorage(response.data), 
                this.$router.go() 
            })
            .catch(() => {
                alert('Identifiant ou mot de passe incorrect !')
            });
        },
        signUp() {
        /*- de 8 à 30 caractères
        - au moins une lettre minuscule
        - au moins une lettre majuscule
        - au moins un chiffre
        - au moins un de ces caractères spéciaux: $ @ % * + - _ !
        - aucun autre caractère possible: pas de & ni de {
        */
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,30})$/;

        /*Pas de caractères spéciaux et nom de domaine avec 2 à 3 lettres*/
        const emailRegex = /^[^@&"/()!_$*€£`+=;?#]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

            if (passwordRegex.test(this.dataLogin.password) == true) {
                if(emailRegex.test(this.dataLogin.email) == true) {
                    axios.post("http://localhost:3000/api/auth/signup", {
                        email: this.dataLogin.email,
                        prenom: this.dataLogin.prenom,
                        nom: this.dataLogin.nom,
                        password: this.dataLogin.password,
                    })
                    .then(response => {
                        this.saveUserInLocalStorage(response.data),
                        this.$store.dispatch('getUserInfos'),
                        this.$router.push('Topic')
                    })
                    .catch(() => {
                        alert('Cette adresse email existe déjà !')
                    });
                } else {
                    alert('Mauvaise adresse email')
                }
            } else {
                alert('Votre mot de mot de passe doit contenir au moins : une lettre minuscule, une lettre majuscule, un chiffre et un de ces caractères spéciaux: $ @ % * + - _ !')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    background-color: rgb(226, 226, 226);
    width: 40%;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    margin: auto;
    margin-top: 10%;
    h1 {
        color: rgba(255, 0, 0, 0.829);
    }
    button {
        height: 40px;
        background-color: rgba(255, 0, 0, 0.829);
        border: none;
        color: white;
        font-weight: bolder;
        font-size: 18px;
        cursor: pointer;
        border-radius: 20px;
        &:hover {
            filter: brightness(1.75);
            transition-duration: 700ms;
        }
    }
    .form {
        display: flex;
        flex-direction: column;
        input {
            height: 40px;
            margin-bottom: 15px;
            border-radius: 20px;
            border: none;
        }
    }
    &__action {
        cursor: pointer;
        text-decoration: underline;
        color: rgba(255, 0, 0, 0.829);
        font-weight: bolder;
        &:active {
            color: white;
        }
    }
}

.card-description {
    background-color: green;
    width: 40%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
}

/*****************************/
/*VERSION MOBILE ET TABLETTE**/ 
/*****************************/

@media only screen and (max-width: 768px) {
    .card {
        width: 75%;
    }
}
</style>