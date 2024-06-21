<template>
  <div class="lol" v-if="!lessonsWithSeperate.length">
    <NotLessons />
  </div>
  <PadBase ref="container" v-else>
    <CardItem v-for="lesson in lessonsWithSeperate" :lesson="lesson" class="item" />
  </PadBase>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { PadBase } from "@/shared/UI/PadBase";
import { CardItem } from "./components/CardItem";
import { NotLessons } from "./../NotLessons/index";

import { useGroupStore } from "@/widgets/MainSetting";
const groupStore = useGroupStore();

const container = ref();

const props = defineProps({
  dayInfo: {
    type: Object,
    required: true,
  },
});



const emit = defineEmits(["isShow"]);

const lessons = computed(() => {
  const result = props.dayInfo.lessons.map((el) => {
    if (groupStore.subgroup === 1 || groupStore.subgroup === 0) {
      if (el?.first) return el.first;
    }
    if (groupStore.subgroup === 2) {
      if (el?.second) return el.second;
    }
  });


  return result.map((el, key) => {
    return {
      ...el,
      key,
    };
  });
});

const lessonsWithSeperate = computed(() => {

  let result = [];
  for (let i = 0; i < lessons.value.length; i++) {
    result.push(lessons.value[i]);
    if (i < lessons.value.length - 1) {
      const currentEndTime = new Date(
        `2023-04-01T${lessons.value[i].time.endTime}:00`
      );

      const nextStartTime = new Date(
        `2023-04-01T${lessons.value[i + 1].time.startTime}:00`
      );
      const diffInMinutes = Math.floor(
        (nextStartTime - currentEndTime) / 1000 / 60
      );

      if (diffInMinutes > 30) {
        result.push({ min: diffInMinutes });
      }
    }
  }
  result = result.filter((el) => el.min || el?.lesson).filter((el, idx, arr) => !(el.min && arr.length - 1 === idx) && !(el.min && 0 === idx));
  return result;
});

onMounted(() => {
  if (container.value?.$el) {
    const body = document.querySelector("#app > div > div.body")
    if (body) {
      body.scrollTop = 0
    }
  }
});

defineExpose({
  lessonsWithSeperate,
});

</script>

<style scoped lang="scss">
.item {
  &:not(:last-child) {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #505050;
  }
}

.lol {
  height: 100%;
}
</style>
