<template>
    <header>
        <div class="nav">
            <img src="../assets/icon-left-font.svg">
            <div>
                <router-link to="/user">Mon compte</router-link>
            </div>
        </div>
  </header>
</template>

<script>
export default {
    name: "Header",


}
</script>

<style scoped lang="scss">

.nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    img {
        width: 300px;
    }
}

</style>
