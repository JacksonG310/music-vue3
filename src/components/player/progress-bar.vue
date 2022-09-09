<template>
  <div class="progress-bar" ref="progressBarRef">
    <div class="bar-inner" @click="onProgressClick">
      <div class="progress" :style="progressStyle" ref="progressRef">
        <div
          class="progress-btn-wrapper"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="progress-btn" :style="btnStyle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
const progressBtnWidth = 16;
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(["progress-changing", "progress-changed"]);

// 设置大屏展开时的进度，防止bug
const setOffset = (progress: number) => {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth;
  // progress是0-1的数值
  offset.value = barWidth * progress;
};

// 进度条长度
const progressBarRef = ref<HTMLElement>();
const offset = ref(0);
watch(
  () => props.progress,
  (newProgress) => {
    // const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth;
    // // progress是0-1的数值
    // offset.value = barWidth * newProgress;
    setOffset(newProgress);
  }
);

// 进度条拖动
const progressRef = ref<HTMLElement>();
const touch = {
  startX: 0,
  moveX: 0,
  beginWidth: 0,
};
const onTouchStart = (e: TouchEvent) => {
  touch.startX = e.touches[0].pageX;
  touch.beginWidth = progressRef.value!.clientWidth;
};
const onTouchMove = (e: TouchEvent) => {
  touch.moveX = e.touches[0].pageX - touch.startX;
  const tempWidth = touch.beginWidth + touch.moveX; // 终点位置
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth;
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0)); // 进度条是由progrss驱动的，所以修改progress
  offset.value = barWidth * progress;
  emits("progress-changing", progress);
};
const onTouchEnd = (e: TouchEvent) => {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth;
  const progress = progressRef.value!.clientWidth / barWidth;
  emits("progress-changed", progress);
};

// 进度条点击
const onProgressClick = (e: MouseEvent) => {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth;
  const { left: progrssLeft } = progressRef.value!.getBoundingClientRect();
  const clickX = e.pageX;
  const offsetX = Math.abs(clickX - progrssLeft);
  const targeProgress = offsetX / barWidth;
  emits("progress-changed", targeProgress);
};

const progressStyle = computed(() => {
  return {
    width: `${offset.value}px`,
  };
});

const btnStyle = computed(() => {
  return {
    transform: `translate3d(${offset.value}px,0,0)`,
  };
});
defineExpose({
  setOffset,
});
</script>
<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
