<template>
  <main>
    <div>
        <input type="email" v-model="dataEdit.email" placeholder="Email" />
        <input type="text" v-model="dataEdit.prenom" placeholder="Prénom" />
        <input type="text" v-model="dataEdit.nom" placeholder="Nom" />
        <input type="text" v-model="dataEdit.biographie" placeholder="Biographie"/>
        <input type="text" v-model="dataEdit.poste" placeholder="Poste" />
        <input type="password" v-model="dataEdit.password" placeholder="Mot de passe" />
        <input type="file" placeholder="Met ta plus belle photo ici"/>
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
        prenom: null,
      },
    }
  }
}
</script>
