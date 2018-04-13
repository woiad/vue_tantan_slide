<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body{
  background: #565f77 none repeat scroll 0 0;
  color: #000;
  font-size: 14px;
  width: 100%;
  height: 100%;
  position: absolute;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif ;
  overflow: hidden;}
</style>
