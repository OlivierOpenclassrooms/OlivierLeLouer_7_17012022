<template>
    <main>
        <div>
            <router-link to="/multitopic">
                <p>Pour poster tes dernières photos et vidéos c'est ici !</p>
            </router-link>
            <router-link to="texttopic">
                <p>Viens discuter ici !</p>
            </router-link>
        </div>
    </main>
</template>

<script>
export default {

    mounted() {
        let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
        
        if (userInLocalStorage == null)
            this.$router.push('/')
    }
}
</script>



<style scoped lang="scss">
    
</style>