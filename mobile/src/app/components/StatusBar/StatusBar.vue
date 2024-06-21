<template>
  <div class="nav">
    <div class="div" :style="'min-height:' + SafeAreaTop + 'px'">
    </div>

    <div id="header"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { SafeArea } from "capacitor-plugin-safe-area";
import { StatusBar, Style } from "@capacitor/status-bar";

const setStatusBarStyleDark = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
};

setStatusBarStyleDark();

const SafeAreaTop = ref(50);

const init = async () => {
  const { insets } = await SafeArea.getSafeAreaInsets();
  const { top } = insets;
  SafeAreaTop.value = top || 50;
};

init();
</script>

<style scoped>
.nav {
  background: var(--color);
  border-bottom: 1px solid #505050;
  border-radius: 0 0 5px 5px;
  z-index: 10;
  box-shadow: 0px 25px 40px -17px rgba(0, 0, 0, 0.5);
}
</style>
