<template>
  <div class="top-list" v-loading="loading">
    <Scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="seletedItem(item)"
        >
          <div class="icon">
            <img width="100" v-lazy height="100" :src="item.pic" alt="" />
          </div>
          <ul class="song-list">
            <li
              class="song"
              v-for="(song, index) in item.songList"
              :key="song.id"
            >
              <span>{{ index + 1 }}</span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Scroll from "@/components/base/scroll/scroll.vue";
import { getTopList } from "@/service/topList";
import TopListItemType = TopList.TopListItemType;
import { ref } from "vue";
import { TOP_KEY } from "@/assets/ts/constants";
import storage from "good-storage";
import { useRouter } from "vue-router";

const loading = ref(false);
const topList = ref<Array<TopListItemType>>();
const getTopListData = async () => {
  const result = await getTopList();
  topList.value = result.topList;

  loading.value = false;
};
getTopListData();

const selectedTop = ref<TopListItemType>();
// 缓存top
const router = useRouter();
const cacheTop = (top: TopListItemType) => {
  storage.session.set(TOP_KEY, top);
};
const seletedItem = (top: TopListItemType) => {
  selectedTop.value = top;
  cacheTop(top);
  router.push({
    path: `/top-list/${top.id}`,
  });
};
</script>

<style scoped></style>
<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
