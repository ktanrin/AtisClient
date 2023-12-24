<template>
<div>
  <AtisDisplay />
</div>
</template>

<script>
import AtisDisplay from './components/AtisDisplay.vue'

export default {
  name: 'App',
  components: {
    AtisDisplay
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: lemonchiffon;
  color: #2c3e50;
  
  padding-left: 20px;
  padding-top: 20px;
  padding-right: 20px;
}
</style>
