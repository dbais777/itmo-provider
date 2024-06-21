<template>
  <Teleport to="#header">
    <CalendarSlider v-if="groupStore?.days" @chooseDay="chooseDay" />
  </Teleport>
  <template v-if="groupStore?.days">
    <Transition :name="groupStore.sliderMode" mode="out-in">
      <CardBase v-if="groupStore?.days[currDay]?.lessons" :day-info="groupStore?.days[currDay]" :key="currDay" />
      <!-- <pre v-if="groupStore?.days[currDay]?.lessons">
        {{ JSON.stringify(groupStore?.days[currDay], 2, 2) }}
      </pre> -->
      <NotLessons v-else :key="currDay + 1" />
    </Transition>
  </template>

  <router-link to="/settings" class="choose-group" v-else>Выберите группу</router-link>
</template>

<script setup>
import { ref } from "vue";
import { useGroupStore } from "@/widgets/MainSetting";
import { CardBase } from "@/entities/CardBase";
import { CalendarSlider } from "@/entities/CalendarSlider";
import { NotLessons } from "@/entities/NotLessons";

const groupStore = useGroupStore();

const currDay = ref(0);

const chooseDay = (val) => {
  currDay.value = val;
};
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: 0.2s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(300px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: 0.2s ease-out;
}

.grow-in-enter-from,
.grow-in-leave-to {
  opacity: 0;
  transform: scale(0.2);
}

.grow-in-enter-active,
.grow-in-leave-active {
  transition: 0.2s ease-out;
}

.grow-out-enter-from,
.grow-out-leave-to {
  opacity: 0;
  transform: scale(1.5);
}

.grow-out-enter-active,
.grow-out-leave-active {
  transition: 0.2s ease-out;
}

.choose-group {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 30rem;
  text-decoration: underline;
}
</style>
