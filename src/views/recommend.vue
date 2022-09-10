<template>
  <div class="recommend" v-loading="loading">
    <Scroll class="scroll-wrapper">
      <div class="scroll-content">
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider
              v-if="data?.sliders.length"
              :sliders="data.sliders"
            ></Slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-if="!loading">热门歌单推荐</h1>
          <ul>
            <li
              class="item"
              :key="item.id"
              v-for="item in data?.albums"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img v-lazy width="60" height="60" :src="item.pic" alt="" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <!-- <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"></component>
      </transition>
    </router-view> -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import RecommendData = Recommend.RecommendData;
import AlbumsType = Recommend.AlbumsType;
import { getAlbum, getRecommend } from "@/service/recommend";
import Slider from "@/components/base/slider/slider.vue";
import Scroll from "@/components/wrap-scroll/wrap-scroll";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import storage from "good-storage";
import { ALBUM_KEY } from "@/assets/ts/constants";
// 获取推荐数据
const data = ref<RecommendData>();
const getRecommendData = async () => {
  data.value = await getRecommend();
};
// 是否在加载
const loading = computed(() => {
  return !(data.value?.albums && data.value?.sliders);
});
getRecommendData();

const router = useRouter();
const selectedAlbum = ref<AlbumsType>();
const cacheAlbum = (album: AlbumsType) => {
  storage.session.set(ALBUM_KEY, album);
};
const selectItem = (album: AlbumsType) => {
  selectedAlbum.value = album;
  cacheAlbum(album);
  router.push(`/recommend/${album.id}`);
};
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .scroll-wrapper {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
