<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in items"
      :key="item"
      :class="{ active: modelValue === index }"
      @click="switchItem(index)"
    >
      <span>{{ item }}</span>
    </li>
    <div class="active-bar" :style="activeStyle"></div>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { PropType } from "vue";

const props = defineProps({
  items: {
    type: Array as PropType<Array<string>>,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["update:modelValue"]);
const activeStyle = computed(() => {
  const x = 120 * props.modelValue;
  return {
    transform: `translate3d(${x}px, 0, 0)`,
  };
});

const switchItem = (index: number) => {
  emits("update:modelValue", index);
};
</script>

<style scoped lang="scss">
.switches {
  display: flex;
  position: relative;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  .switch-item {
    position: relative;
    z-index: 10;
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active {
      color: $color-text;
    }
  }
  .active-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 30px;
    transition: transform 0.3s;
    border-radius: 5px;
    background: $color-highlight-background;
  }
}
</style>
