<template>
  <div class="tabs">
    <div class="tab" v-for="item in props.tabs" @click="chooseTab(item)">
      {{ item.title }}
    </div>
    <div
      class="bg"
      :style="`transform: translate(${currenIdx * 100}%); width: ${
        100 / props.tabs.length
      }%`"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const currenIdx = ref("info");
const props = defineProps({
  tabs: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["chooseTab"]);

const chooseTab = (item) => {
  currenIdx.value = item.id;
  emit("chooseTab", item);
};
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  justify-content: space-around;
  background: #bdbdbd;
  height: 40px;
  border-radius: 99px;
  position: relative;
}

.tab {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-weight: bold;
  font-size: 24rem;
  color: #333;
  font-weight: 500;
  z-index: 23;
}
.bg {
  position: absolute;
  background: #fff;

  height: 100%;
  left: 0;
  top: 0;
  border-radius: inherit;
  transition: all 0.3s;
}
</style>
