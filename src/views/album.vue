<template>
  <div class="album">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading">
    </music-list>
  </div>
</template>

<script lang="ts">
import { ALBUM_KEY } from "@/assets/ts/constants";
import detiailComponentFactory from "@/assets/ts/detailComponent-factory";
import { getAlbum } from "@/service/recommend";

export default detiailComponentFactory("album", ALBUM_KEY, getAlbum);
</script>
<style lang="scss">
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
