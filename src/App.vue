<template>
  <div id="app">
    <ContainerMain/>
  </div>
</template>

<script>
import ContainerMain from "./components/ContainerMain.vue";

export default {
  name: "app",
  components: {
    ContainerMain
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
}
</style>
