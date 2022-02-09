<template>
    <header>
        <div class="header">
            <div class="header__icon">
                <img src="../assets/icon.svg" alt="Logo de Groupomania">
                <p>Groupomania</p>
            </div>
            <div class="nav">
                <div class="nav__card">
                    <i class="far fa-comments"></i>
                    <p @click="this.$router.push('/texttopic')">Discussions</p>
                </div>
                <div class="nav__card">
                    <i class="fas fa-tablet-alt"></i>
                    <p @click="this.$router.push('/multitopic')">Multimédia</p>
                </div>
                <div class="nav__card">
                    <i class="fas fa-user"></i>
                    <p @click="this.$router.push('/user')">Mon compte</p>
                </div>
                <div class="nav__card">
                    <i class="fas fa-door-open"></i>
                    <p @click="deconnectUser">Deconnexion</p>
                </div>
            </div>
        </div>
  </header>
</template>

<script>
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
        }
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

    &__icon {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img {
            max-height: 100px;
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
    width: 40%;
    height: 100%;
    &__card {
        display: flex;
        flex-direction: column;
        &:hover {
            color: red;
            cursor: pointer;
        }
    }
}

</style>
