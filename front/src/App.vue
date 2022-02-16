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

.container-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
        border-radius: 10px;
        font-weight: bold;
        color: white;
        height: 30px;
        width:15%;
        margin: 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 400ms;
        &:hover {
            cursor: pointer;
            filter: brightness(1.07);
            box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        }
    }
}

</style>
