<template>
  <div id="app">
    <Header></Header>
    <Tab></Tab>
    <router-view :style="routerStyle" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <Player></Player>
  </div>
</template>
<script setup lang="ts">
import Header from "@/components/header/header.vue";
import Tab from "@/components/tab/tab.vue";
import { computed } from "vue";
import { useStore } from "vuex";
import Player from "./components/player/player.vue";

const store = useStore();
const playList = computed(() => store.state.playList);
const routerStyle = computed(() => {
  const bottom = playList.value.length ? "60px" : "0";
  return {
    bottom,
  };
});
</script>
<style lang="scss">
#app {
  height: 100vh;
}
</style>
