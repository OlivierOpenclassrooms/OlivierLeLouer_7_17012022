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

/*GENERAL FORM*/

.card-create {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    &__form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        &__description {
            width: 80%;
            height: 30px;
            border-radius: 10px 0px 0px 10px;
        }
    }
}

input:focus {
  outline: none;
}

/*GENERAL BUTTON CREATE*/

.button-create {
    display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 0px 10px 10px 0px;
      font-weight: bold;
      color: white;
      height: 35px;
      width: 20%;
      margin: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 400ms;
      border: none;
      &:hover {
        cursor: pointer;
        filter: brightness(1.07);
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }
}


/*MODIFICATION ET SUPPRESSION COMMENTAIRE*/

.container-buttons {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    align-items: center;
    justify-content: center;
}

.form-modify {
    margin-right: 10px;
    &__description {
        border-radius: 10px;
    }
}

.button-comment {
    border: none;
    background: none;
    color: #2c3e50;
    &:hover {
        cursor: pointer;
    }
}

</style>
