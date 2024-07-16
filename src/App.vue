<template>
  <div class="container">
    <div class="sidebar-wrap">
      <Sidebar></Sidebar>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/sidebar/Sidebar.vue";

export default {
  data: () => ({ value: 1 }),
  name: "App",
  components: {
    Sidebar,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  font-size: 15px;
  font-family: "Roboto", sans-serif;
}

#app {
  width: 100%;
}

.sidebar-wrap {
  max-width: 220px;
}

.container {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 72px;
}

.content {
  flex: 1;
  margin: 12px;
}
</style>