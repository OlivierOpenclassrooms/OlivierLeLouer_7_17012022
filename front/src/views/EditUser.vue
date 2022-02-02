<template>
  <main>
    <div>
        <input type="email" v-model="dataEdit.email" placeholder="Email" required />
        <input type="text" v-model="dataEdit.prenom" placeholder="Prénom" required />
        <input type="text" v-model="dataEdit.nom" placeholder="Nom" required />
        <input type="text" v-model="dataEdit.biographie" placeholder="Biographie" required />
        <input type="text" v-model="dataEdit.poste" placeholder="Poste" required />
        <input type="password" v-model="dataEdit.password" placeholder="Mot de passe" required />
    </div>
  </main>
</template>

<script>

export default {
  name: "EditUser",
  data() {
    return {
      dataEdit: {
        nom: null,
        email: null,
        password: null,
        biographie: null,
        poste: null,
        prenom: null
      },
    }
  }
}
</script>
