<template>
    <div id="header">
      <Header/>
    </div>
    <main>
      <div id="page-container">
        <router-view/>
      </div>
    </main>
</template>

<script>
import Header from "./components/Header.vue"

export default {
  components: {
    Header
  }
};
</script>


<style lang="scss">
html {
  margin: 0;
  padding:0;
  height: 100%;
}
.general-color { 
  margin : 0px;
  padding : 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  height: 100%;
}

#header {
  width: 100%;
  border-bottom: 3px solid rgb(233, 233, 233);
  background-color: white;
}

#page-container {
  max-width: 1024px;
  margin: auto;
}

</style>
