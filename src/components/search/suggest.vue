<template>
  <div ref="rootRef" class="suggest" v-loading="loading" v-no-result="noResult">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { search } from "@/service/search";
import { processSongs } from "@/service/song";
const props = defineProps({
  query: String,
  showSinger: {
    type: Boolean,
    default: true,
  },
});
const singer = ref();
const songs = ref<Array<SongDetailType>>([]);
const hasMore = ref(true);
const page = ref(1);

// 监听query
// watch(
//   () => props.query,
//   async (newQuery) => {
//     if (!newQuery) return;
//     await searchFirst();
//   }
// );
// const searchFirst = async () => {
//   page.value = 1;
//   songs.value = [];
//   singer.value = null;
//   hasMore.value = true;
//   const result = await search(props.query, page.value, props.showSinger);
//   console.log(result);

//   songs.value = await processSongs(result.songs);
//   singer.value = result.singer;
//   hasMore.value = result.hasMore;
// };

const loading = ref(false);
const noResult = ref(false);
const selectSinger = (singer: any) => {};
const selectSong = (song: any) => {};
const pullUpLoading = () => {};
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
