<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input class="input-inner" v-model="query" :placeholder="placeholder" />
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { debounce } from "lodash";

// 双向绑定
const props = defineProps({
  modelValue: String,
});
const emits = defineEmits(["update:modelValue"]);
const query = ref(props.modelValue);
// 内部改变，传给外部
watch(
  query,
  debounce((newValue) => {
    emits("update:modelValue", newValue);
  }, 300)
);

// 外部改变传给内部
watch(
  () => props.modelValue,
  (newModelValue) => {
    query.value = newModelValue;
  }
);

const placeholder = ref("搜索歌曲、歌手");
// 清除搜索词
const clear = () => {
  query.value = "";
};
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
