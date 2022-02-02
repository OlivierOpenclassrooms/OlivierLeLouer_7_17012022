<template>
  <main>
    <div>
      <button>Supprimer mon compte</button>
    </div>
    <router-link to="/edituser">Modifier son profil</router-link>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "User",
  data() {
    return {
      
    }
  },
  methods: {
    deleteAccount() {
      axios.delete(`http://localhost:3000/api/auth/`)
    }
  }
}

</script>
