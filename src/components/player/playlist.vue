<template>
  <!-- 通过冒泡实现点击空白隐藏 -->
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playList.length"
        @click.stop="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <Scroll class="list-content" ref="scrollRef">
            <transition-group tag="ul" ref="listRef" name="list">
              <!-- <ul ref="listRef"> -->
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click.stop="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"> </i>
                <span class="text">{{ song.name }}</span>
                <span class="favourite" @click.stop="toggleFavourite(song)">
                  <i :class="getFavouriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
              <!-- </ul> -->
            </transition-group>
          </Scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>

        <Confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></Confirm>
      </div>
    </transition>
  </teleport>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
import useMode from "./useMode";
import useFavourite from "./useFavourite";
import Scroll from "../base/scroll/scroll.vue";
import Confirm from "../base/confirm/confirm.vue";

const store = useStore();
const visible = ref(false);
const playList = computed(() => store.state.playList);
const sequenceList = computed(() => store.state.sequenceList);

const { modeIcon, changeMode, modeText } = useMode();
const { getFavouriteIcon, toggleFavourite } = useFavourite();

// 切歌
const selectItem = (song: SongDetailType) => {
  const index = playList.value.findIndex(
    (item: SongDetailType) => song.id === item.id
  );
  store.commit("setCurrentIndex", index);
  store.commit("setPlayingState", true);
};

// 获取当前播放图标
const currentSong = computed(() => store.getters.currentSong);
watch(currentSong, async (newSong) => {
  if (!visible.value || !newSong.id) return;
  await nextTick();
  scrollToCurrentSong();
});
const getCurrentIcon = (song: SongDetailType) => {
  if (song.id === currentSong.value.id) return "icon-play";
};
// 移除歌曲
const removing = ref(false);
const removeSong = (song: SongDetailType) => {
  // 防止多次点击移除
  if (removing.value) return;
  removing.value = true;
  store.dispatch("removeSong", song);
  if (!playList.value.leave) hide();
  setTimeout(() => {
    removing.value = false;
  }, 300);
};

// 隐藏
const hide = () => {
  visible.value = false;
};
// 显示
const show = async () => {
  visible.value = true;
  await nextTick();
  scrollToCurrentSong();
  refrenshScroll();
};

// 刷新Scroll
const scrollRef = ref();
const refrenshScroll = () => {
  scrollRef.value.scroll.refresh();
};
const listRef = ref();
const scrollToCurrentSong = () => {
  const index = sequenceList.value.findIndex(
    (song: SongDetailType) => song.id === currentSong.value.id
  );
  if (index == -1) return;
  const currentSongEl = listRef.value.$el.children[index];
  scrollRef.value.scroll.scrollToElement(currentSongEl, 300);
};

// 清空列表
const confirmRef = ref();
const showConfirm = () => {
  confirmRef.value.show();
};
const confirmClear = () => {
  store.dispatch("clearSongList");
  hide();
};
defineExpose({
  show,
});
</script>
<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favourite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favourite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
