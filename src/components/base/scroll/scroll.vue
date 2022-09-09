<template>
  <div ref="scrollRef">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useScroll from "./useScroll";

const props = defineProps({
  click: {
    type: Boolean,
    default: true,
  },
  probeType: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["scroll"]);

const scrollRef = ref();
const { scroll } = useScroll(scrollRef, props, emits);

defineExpose({
  scroll,
});
</script>
