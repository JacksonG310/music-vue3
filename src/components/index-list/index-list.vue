<template>
  <Scroll @scroll="onScroll" :probe-type="3" class="index-list" ref="scrollRef">
    <ul ref="groupRef">
      <li class="group" v-for="group in groupList" :key="group.title">
        <h2 class="title">{{ group.title }}</h2>
        <ul class="group-item">
          <li
            class="item"
            @click="onItemClick(item)"
            v-for="item in group.list"
            :key="item.id"
          >
            <img class="avatar" v-lazy :src="item.pic" alt="" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" ref="fixedRef" v-show="!!fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent="onShortcutTouchEnd"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :class="{ current: currentGroupIndex === index }"
          :data-index="index"
          :key="item"
          class="item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import Scroll from "../wrap-scroll/wrap-scroll";
import useFixed from "./useFixed";
import useShortcut from "./useShortcut";
import SingerGroupType = Singer.SingerGroupType;
import SingerItemType = Singer.SingerItemType;
const props = defineProps({
  groupList: {
    type: Array as PropType<Array<SingerGroupType>>,
    required: true,
  },
});
const emits = defineEmits(["selectSinger"]);
const onItemClick = (item: SingerItemType) => {
  emits("selectSinger", item);
};
const { groupRef, onScroll, fixedTitle, fixedStyle, currentGroupIndex } =
  useFixed(props);
const {
  scrollRef,
  shortcutList,
  onShortcutTouchStart,
  onShortcutTouchMove,
  onShortcutTouchEnd,
} = useShortcut(props, groupRef);
</script>
<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: -1px;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
