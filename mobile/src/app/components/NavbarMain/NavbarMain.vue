<template>
  <div class="nav">
    <div class="nav__inner" :style="SafeAreaBottom && 'padding-bottom: 25px;'">
      <router-link class="link" to="/">
        <ScheduleIcon color="#fff" width="50px" height="50px" />
        <!-- '#666'" -->
      </router-link>
      <router-link class="link" to="/settings">
        <SettingIcon color="#fff" width="50px" height="50px" />
        <!-- '#666'" -->
      </router-link>
      <router-link class="link" to="/teachers">
        <TeachersIcon color="#fff" width="50px" height="50px" />
        <!-- '#666'" -->
      </router-link>

      <span @click="openMap" class="link">
        <MapIcon color="#fff" width="50px" height="50px" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ScheduleIcon } from "./components/icons";
import { SettingIcon } from "./components/icons";
import { TeachersIcon } from "./components/icons";
import { MapIcon } from "./components/icons";
import { SafeArea } from "capacitor-plugin-safe-area";

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs'

let viewer


const openMap = () => {
  if (!viewer) {
    const img = new Image()

    viewer = new Viewer(img, {
      url: () => '/map.jpg',
      button: false,
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: {
          show: 1,
          size: 'large',
          click: (e) => {
            e.preventDefault()
            viewer.zoom(.5)
          }
        },
        zoomOut: {
          show: 1,
          size: 'large',
          click: (e) => {
            e.preventDefault()
            viewer.zoom(-.5)
          }
        },
        oneToOne: 4,
        reset: 4,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 0,
        flipVertical: 0,
      },

    });


  }

  viewer.view()

}

const init = async () => {
  const { insets } = await SafeArea.getSafeAreaInsets();
  const { top } = insets;
  SafeAreaBottom.value = top

};

onMounted(() => {
  init()
})
</script>


<style scoped lang="scss">
.map {
  width: 1px;
  height: 1px;
  opacity: 0;
  display: none;
}

.nav {
  height: 80px;
  background: var(--color);
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #505050;
  border-radius: 10px 10px 0 0;
  display: flex;

  &__inner {
    padding: 10px;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    display: flex;
    box-shadow: 0px -22px 38px -17px rgba(0, 0, 0, 0.36);
  }
}

.link {
  height: 70px;
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform, opacity 0.3s ease;
  opacity: 25%;

  &.router-link-active {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>
