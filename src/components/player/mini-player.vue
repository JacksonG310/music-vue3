<template>
  <transition name="mini">
    <div v-show="!fullScreen" class="mini-player" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            width="40"
            height="40"
            :src="currentSong.pic"
            :class="cdClass"
            alt=""
            ref="cdImgRef"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <Playlist ref="playListRef"></Playlist>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useStore } from "vuex";
import useCd from "./useCd";
import useMiniSlider from "./useMiniSlider";
import progressCircle from "./progressCircle.vue";
import Playlist from "./playlist.vue";
type togglePlayType = (e: MouseEvent) => void;
defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  togglePlay: Function as PropType<togglePlayType>,
});

const store = useStore();

const currentSong = computed(() => store.getters.currentSong);
const fullScreen = computed(() => store.state.fullScreen);
// 播放暂停
const playing = computed(() => store.state.playing);
const miniPlayIcon = computed(() => {
  return playing.value ? "icon-pause-mini" : "icon-play-mini";
});

// 控制全屏
const showNormalPlayer = () => {
  store.commit("setFullScreen", true);
};
// cd转动
const { cdClass, cdRef, cdImgRef } = useCd();

// 滑动切歌
const playList = computed(() => store.state.playList);
const { sliderWrapperRef } = useMiniSlider();

// 显示列表
const playListRef = ref();
const showPlaylist = () => {
  playListRef.value.show();
};
</script>
<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;

    padding: 0 10px;

    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
