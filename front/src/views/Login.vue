<template>
    <main>
        <div>
            <label>Email</label>
            <input type="email" v-model="dataLogin.email" required/>
        </div>
        <div>
            <label>Mot de passe</label>
            <input type="password" v-model="dataLogin.password" required/>
        </div>
        <button @click.prevent="Login">Se connecter</button>
        <router-link to="/signup">S'inscrire</router-link>
        <router-view/>
    </main>
</template>

<script>
import axios from "axios";

export default {
    name: "Login",
    data () {
        return {
            dataLogin: {
                email: null,
                password: null
            }
        }
    },
    methods: {
        Login () {
            axios.post("http://localhost:3000/api/auth/login", {
                email: this.dataLogin.email,
                password: this.dataLogin.password
            })
            .then(response => {
            console.log(response)
            })
            .catch(error => {console.log(error, error.response), alert("Mauvais identifiant ou mot de passe")})
        }
    }
}
</script>