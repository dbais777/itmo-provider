<template>
  <div class="wrapper">
    <StatusBar />
    <div class="body">
      <RouterView />
    </div>
    <NavbarMain />
  </div>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import { NavbarMain } from "./components/NavbarMain";
import { StatusBar } from "./components/StatusBar";

window.screen.orientation.lock('portrait');

const color = useStorage('color', '#262626')
const color2 = useStorage('color2', '#1c1c1c')


document.body.style.setProperty('--color', color.value)
document.body.style.setProperty('--color2', color2.value)
</script>

<style scoped lang="scss">
.body {
  overflow-y: auto;
  overscroll-behavior: none;
  height: 100%;
}

.wrapper {
  display: flex;
  height: calc(100vh - 80px);
  /* заменяем max-height на height */
  flex-direction: column;
}

::v-deep(.ui-container) {
  padding: 20px;
}
</style>
