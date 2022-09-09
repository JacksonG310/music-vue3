<template>
  <div class="singer" v-loading="loading">
    <index-list
      v-if="result?.singers.length"
      :groupList="result?.singers"
      @selectSinger="selectSinger"
    ></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SingerListData = Singer.SingerListData;
import SingerItemType = Singer.SingerItemType;
import { getSingerList } from "../service/singer";
import { useRouter } from "vue-router";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/ts/constants";
import IndexList from "../components/index-list/index-list.vue";

const result = ref<SingerListData>();
const getSingerListData = async () => {
  result.value = await getSingerList();
};

getSingerListData();

const loading = computed(() => {
  return !!!result.value?.singers.length;
});

const selectedSinger = ref<SingerItemType>();
const router = useRouter();
// 缓存歌手
const cacheSinger = (singer: SingerItemType) => {
  storage.session.set(SINGER_KEY, singer);
};
const selectSinger = (item: SingerItemType) => {
  selectedSinger.value = item;
  cacheSinger(item);
  router.push({
    path: `/singer/${item.mid}`,
  });
};
</script>

<style scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
