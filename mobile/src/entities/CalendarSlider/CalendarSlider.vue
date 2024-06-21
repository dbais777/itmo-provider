<template>
  <div class="container">
    <div class="slider-track">
      <div class="slider-item" :style="`background: ${currDay.idx === item.idx ? color2 : color1}`"
        :id="'day-' + item.idx" @click="
          currDay = item;
        emit('chooseDay', item.idx);
        scrollTo(item.idx, true);
        " v-for="item in groupStore.days">
        <div class="badge" v-if="item.lessons !== null" />
        <div class="item-month">
          {{ getMonth(item.time) }}
        </div>

        <div class="item-number">{{ moment(item.time).format("D") }}</div>
        <div class="item-day">
          {{ weekdays[moment(item.time).format("d")] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useGroupStore } from "@/widgets/MainSetting/model";
import moment from "moment";
import Xwiper from 'xwiper';
import { useStorage } from "@vueuse/core";

const color1 = useStorage('color', '#262626')
const color2 = useStorage('color2', '#1c1c1c')
const xwiper = new Xwiper('.body')

const emit = defineEmits(["chooseDay"]);

const statusHandler = () => {
  currDay.value = groupStore.days.find((el) => {
    return (
      new Date(el.time).toLocaleDateString() === new Date().toLocaleDateString()
    );
  });
  scrollTo(currDay.value.idx);
  emit("chooseDay", currDay.value.idx);
};

const groupStore = useGroupStore();

const currDay = ref(
  groupStore.days.find((el) => {
    return (
      new Date(el.time).toLocaleDateString() === new Date().toLocaleDateString()
    );
  })
);

const scrollTo = async (id, smooth = false) => {
  await new Promise(res => setTimeout(res, 0))

  const el = document.getElementById("day-" + id);
  el.scrollIntoView({
    inline: "center",
    behavior: smooth ? "smooth" : "auto",
  });


};

const nextDay = () => {
  const newId = JSON.parse(currDay.value.idx) + 1
  if (!groupStore.days[newId]) return
  currDay.value = (groupStore.days[newId])
  scrollTo(newId, true)
  emit("chooseDay", newId);
}
const prevDay = () => {
  const newId = JSON.parse(currDay.value.idx) - 1
  if (!groupStore.days[newId]) return
  currDay.value = (groupStore.days[newId])
  scrollTo(newId, true)
  emit("chooseDay", newId);
}

onUnmounted(() => {
  xwiper.destroy()
})

onMounted(() => {
  xwiper.onSwipeLeft(nextDay)
  xwiper.onSwipeRight(prevDay)

  scrollTo(currDay.value.idx);
  setTimeout(() => {
    scrollTo(currDay.value.idx);
  }, 1000)
  emit("chooseDay", currDay.value.idx);
  window.addEventListener("statusTap", statusHandler);
});

const getMonth = (time) => {
  return months[(new Date(time).getMonth() + 1)]
}

const months = [
  "дек",
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];
const weekdays = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
</script>

<style scoped lang="scss">
.arrow {
  height: 50px;

  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  .rotate {
    transform: rotate(180deg);
  }
}

.container {
  overflow: hidden;
  position: relative;
  align-items: center;
  display: flex;
}

.item-month {
  font-size: 12rem;
}

.item-day {
  font-size: 12rem;
}

.item-number {
  font-size: 35rem;
}

.slider-track {
  display: flex;
  z-index: 23;
  height: 80px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.img__arrow {
  min-width: 100%;
  height: 100%;
}

.slider-item {
  position: relative;
  transition: all 0.3s;
  align-items: center;
  z-index: -2;
  border: 1px solid black;
  display: flex;
  flex: 0 0 80px;
  justify-content: center;
  scroll-snap-align: center;

  flex-direction: column;
  background: var(--color2);

  border: 1px solid #505050;
  border-radius: 10px;

  &:not(:last-child) {
    margin-right: 10px;
  }

  margin-bottom: 5px;
}

.badge {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #BDBDBD;
  border: 1px solid #505050;
  border-radius: 50%;
  right: 4px;
  top: 4px;
}
</style>
