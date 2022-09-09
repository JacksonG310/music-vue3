<template>
  <div class="top-detail">
    <MusicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
      rank
    ></MusicList>
  </div>
</template>
<script lang="ts">
import detiailComponentFactory from "@/assets/ts/detailComponent-factory";
import { TOP_KEY } from "@/assets/ts/constants";
import { getTopListDetail } from "@/service/topList";

export default detiailComponentFactory("topDetail", TOP_KEY, getTopListDetail);
</script>

<style lang="scss" scoped>
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
