<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h2 class="title">{{ currentSong.name }}</h2>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div ref="cdRef" class="cd">
                <img
                  :src="currentSong.pic"
                  class="image"
                  :class="cdClass"
                  alt=""
                  ref="cdImgRef"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{ playingLyric }}
              </div>
            </div>
          </div>
          <Scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div v-if="currentSongLyric" ref="lyricListRef">
                <p
                  class="text"
                  v-for="(line, index) in currentSongLyric.lines"
                  :key="line.num"
                  :class="{ current: currentLineIndex === index }"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>
                  {{ pureMusicLyric }}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progressBar
                ref="progressBarRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progressBar>
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="disableClass">
              <i class="icon-prev"></i>
            </div>
            <div
              class="icon i-center"
              @click="togglePlay"
              :class="disableClass"
            >
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="disableClass">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right" @click="toggleFavourite(currentSong)">
              <i
                class="icon-not-favourite"
                :class="getFavouriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer :progress="progress" :toggle-play="togglePlay"></MiniPlayer>
    <audio
      ref="audioRef"
      @canplay="ready"
      @error="error"
      @pause="pause"
      @ended="end"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted, Component } from "vue";
import { useStore } from "vuex";
import useMode from "./useMode";
import useCd from "./useCd";
import useFavourite from "./useFavourite";
import useLyric from "./useLyric";
import useMiddleActive from "./useMiddleActive";
import progressBar from "./progress-bar.vue";
import { formatTime } from "@/assets/ts/util";
import { PLAY_MODE } from "@/assets/ts/constants";
import Scroll from "../base/scroll/scroll.vue";
import MiniPlayer from "./mini-player.vue";
import useCdAnimation from "./useCdAnimation";

const store = useStore();
// ???????????????
const fullScreen = computed(() => store.state.fullScreen as boolean);
const currentSong = computed(
  () => store.getters.currentSong as Song.SongDetailType
);

// ??????????????????????????????????????????????????????????????????????????????
const songReady = ref(false);
const ready = () => {
  // ????????????????????????????????????
  if (songReady.value) return;
  songReady.value = true;
  // ??????usePlayLyric??????????????????????????????????????????ready?????????
  playLyric();
  console.log("ready");
};
// ???????????????????????????????????????
const error = () => {
  songReady.value = true;
};
const disableClass = computed(() => {
  return songReady.value ? "" : "disable";
});

// ????????????
const audioRef = ref<HTMLAudioElement>();
watch(currentSong, (newSong: Song.SongDetailType) => {
  if (!newSong.id || !newSong.url) return;
  songReady.value = false;
  console.log("change false");
  currentTime.value = 0;
  audioRef.value!.src = newSong.url;
  audioRef.value!.play();
  store.commit("setPlayingState", true);
});

// ??????/??????
const playing = computed(() => store.state.playing);
const playIcon = computed(() => (playing.value ? "icon-pause" : "icon-play"));
const togglePlay = () => {
  if (!songReady.value) return;
  store.commit("setPlayingState", !playing.value);
};
const pause = () => {
  // ???????????????????????????
  store.commit("setPlayingState", false);
};
watch(playing, (newPlaying: boolean) => {
  if (!songReady.value) return;
  if (newPlaying) {
    audioRef.value!.play();
    playLyric();
  } else {
    audioRef.value!.pause();
    stopLyric();
  }
});

// ?????????/?????????
const currentIndex = computed(() => store.state.currentIndex);
const playList = computed(() => store.state.playList);
const prev = () => {
  if (!songReady.value || !playList.value.length) {
    return;
  }
  if (playList.value.length === 1) {
    loop();
  } else {
    let index = currentIndex.value - 1;
    if (index === -1) {
      index = playList.value.length - 1;
    }
    store.commit("setCurrentIndex", index);
    // songReady.value = false;
    // if (!playing.value) {
    //   store.commit("setPlayingState", true);
    // }
  }
};
const next = () => {
  if (!songReady.value || !playList.value.length) {
    return;
  }
  if (playList.value.length === 1) {
    loop();
  } else {
    let index = currentIndex.value + 1;
    if (index === playList.value.length) {
      index = 0;
    }
    store.commit("setCurrentIndex", index);
    // songReady.value = false;
    // if (!playing.value) {
    //   store.commit("setPlayingState", true);
    // }
  }
};

// ???????????????
let progressIsChanging = ref(false);
const currentTime = ref(0); // ??????????????????
const progress = computed(() => {
  return currentTime.value / currentSong.value.duration;
}); // ????????????
const updateTime = (e: Event) => {
  if (progressIsChanging.value) return;
  const audioEl = e.target as HTMLAudioElement;
  currentTime.value = audioEl.currentTime;
};

// ???????????????
const onProgressChanging = (progress: number) => {
  progressIsChanging.value = true;
  currentTime.value = currentSong.value.duration * progress;
  playLyric();
  stopLyric();
};
const onProgressChanged = (progress: number) => {
  currentTime.value = currentSong.value.duration * progress;
  audioRef.value!.currentTime = currentSong.value.duration * progress;
  if (!playing.value) {
    store.commit("setPlayingState", true);
  }
  progressIsChanging.value = false;
  playLyric();
};

// ??????????????????
const playMode = computed(() => store.state.playMode);
const end = () => {
  currentTime.value = 0;
  if (playMode.value === PLAY_MODE.loop) {
    loop();
  } else {
    next();
  }
};

// ??????????????????
const { modeIcon, changeMode } = useMode();
// ????????????
const loop = () => {
  store.commit("setPlayingState", true); // ????????????????????????pause??????
  audioRef.value!.currentTime = 0;
  audioRef.value!.play();
};

// ??????CD?????????
const { cdClass, cdRef, cdImgRef } = useCd();
// ??????
const { toggleFavourite, getFavouriteIcon } = useFavourite();
// ??????
const {
  currentSongLyric,
  currentLineIndex,
  playLyric,
  stopLyric,
  lyricListRef,
  lyricScrollRef,
  pureMusicLyric,
  playingLyric,
} = useLyric({
  songReady,
  currentTime,
});

// ??????????????????
const {
  currentShow,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd,
  middleLStyle,
  middleRStyle,
} = useMiddleActive();
// ??????
const goBack = () => {
  store.commit("setFullScreen", false);
};
// ??????fullScreen????????????????????????
const progressBarRef = ref();
watch(fullScreen, async (newFullScreen) => {
  if (newFullScreen) {
    await nextTick(); // setOffset?????????dom
    progressBarRef.value.setOffset(progress.value);
  }
});
// cd??????
const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useCdAnimation();
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favourite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
