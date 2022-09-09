<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    ></MusicList>
  </div>
</template>

<script lang="ts">
import detailComponentFactory from "@/assets/ts/detailComponent-factory";
import { SINGER_KEY } from "@/assets/ts/constants";
import { getSingerDetail } from "@/service/singer";

export default detailComponentFactory(
  "singer-detail",
  SINGER_KEY,
  getSingerDetail
);
// import { getSingerDetail } from "@/service/singer";
// import { processSongs } from "@/service/song";
// import SingerItemType = Singer.SingerItemType;
// import MusicList from "@/components/music-list/music-list.vue";
// import { computed, ref } from "vue";
// import storage from "good-storage";
// import { SINGER_KEY } from "@/assets/ts/constants";
// import { useRoute, useRouter } from "vue-router";
// const props = defineProps({
//   singer: {
//     type: Object as () => SingerItemType,
//     defalut: {},
//   },
// });

// // 获取歌手信息
// const route = useRoute();
// const router = useRouter();
// 获取缓存的signer，解决刷新报错
// const computedSinger = computed(() => {
//   let ret = null;
//   let singer = props.singer;
//   if (singer) {
//     ret = singer;
//   } else {
//     const cachedSinger = storage.session.get(SINGER_KEY) as SingerItemType;
//     if (cachedSinger && route.params.id === cachedSinger.mid) {
//       ret = cachedSinger;
//     }
//   }

//   return ret as SingerItemType;
// });
// let result = ref([]);
// let songs = ref([]);
// let loading = ref(true);
// const getSingerDetailData = async () => {
//   if (!computedSinger.value) {
//     const path = route.matched[0].path;
//     router.push({
//       path,
//     });
//     return;
//   }
//   result.value = await getSingerDetail(computedSinger.value);
//   //   @ts-ignore
//   songs.value = await processSongs(result.value.songs);
//   loading.value = false;
// };

// getSingerDetailData();

// // 歌手图片
// const pic = computed(() => {
//   return computedSinger.value!.pic;
// });

// const title = computed(() => {
//   return computedSinger.value!.name;
// });
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
