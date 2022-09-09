<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="goBack"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImg">
      <div class="play-btn-wrapper">
        <div
          class="play-btn"
          v-show="songs.length > 0"
          :style="playBtnStyle"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="listStyle"
      v-loading="loading"
      v-no-result="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @selectItem="selectItem"></song-list>
      </div>
    </Scroll>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Scroll from "../wrap-scroll/wrap-scroll";
import songList from "../base/song-list/song-list.vue";
import SongDetailType = Song.SongDetailType;

const props = defineProps({
  songs: {
    type: Array as () => Array<SongDetailType>,
    default: [],
  },
  title: String,
  pic: String,
  loading: Boolean,
});

// 单击播放
const store = useStore();
const selectItem = ({ song, index }: any) => {
  store.dispatch("setectPlay", {
    list: props.songs,
    index: index as number,
  });
};
// 点击随机播放按钮
const random = () => {
  store.dispatch("randomPlay", props.songs);
};

const noResult = computed(() => {
  return !props.loading && !props.songs.length;
});

// 头部高度
const RESERVED_HEIGHT = 40;

// 动态计算图片高度
const imageHeight = ref(0);
const bgImg = ref<HTMLElement>();
onMounted(() => {
  imageHeight.value = bgImg.value!.clientHeight;
});
const playList = computed(() => store.state.playList);
const listStyle = computed(() => {
  const bottom = playList.value.length ? "60px" : "0";
  return {
    top: `${imageHeight.value}px`,
    bottom,
  };
});

// 监听滚动
const scrollY = ref(0);
const maxTranslateY = ref(0);
const onScroll = (pos: any) => {
  scrollY.value = -1 * pos.y;
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT;
};
// 图片链接及层级
const bgImageStyle = computed(() => {
  let zIndex = 0;
  let paddingTop = "70%";
  let height = 0;
  let translateZ = 0;

  if (scrollY.value > maxTranslateY.value) {
    zIndex = 10;
    paddingTop = "0%";
    height = RESERVED_HEIGHT;
    // 兼容IOS
    translateZ = 1;
  }

  //   下拉缩放
  let scale = 1;
  if (scrollY.value < 0) {
    scale = 1 + Math.abs(scrollY.value / imageHeight.value);
  }
  return {
    backgroundImage: `url(${props.pic})`,
    zIndex,
    height: `${height}px`,
    paddingTop,
    transform: `scale(${scale}) translateZ(${translateZ}px)`,
  };
});
// 图片模糊
const filterStyle = computed(() => {
  const maxBlurVal = (maxTranslateY.value / imageHeight.value) * 20;

  let blur = 0;
  if (scrollY.value >= 0) {
    blur = Math.min(maxBlurVal, (scrollY.value / imageHeight.value) * 20);
  }
  return {
    backdropFilter: `blur(${blur}px)`,
  };
});
// 随机按钮
const playBtnStyle = computed(() => {
  let display = scrollY.value >= maxTranslateY.value ? "none" : "";
  return {
    display,
  };
});
// 回退
const router = useRouter();
const goBack = () => {
  router.back();
};
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
