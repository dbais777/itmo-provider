<template>
  <div class="ui-container">
    <h2 class="title">Основные настройки</h2>

    <div class="section">
      <div class="section__wrapper">
        <span>Группа: </span>
        <span class="section__choose" v-if="groupStore?.groupInfo?.groupTitle">{{ groupStore.groupInfo.groupTitle }}
        </span>
        <span v-else class="section__choose">Группа не выбрана</span>
      </div>

      <ButtonBase @click="isModalGroupOpen = true" :style="'danger'">Выбрать</ButtonBase>
    </div>

    <HrBase />

    <h2 class="title">Персонализация</h2>
    <div class="section mb">
      <div class="section__wrapper">
        <span>Эффект слайдера</span>
      </div>

      <SelectBase :current="groupStore.sliderMode" :list="TypesOfSlider" @choose="chooseSlider"></SelectBase>
    </div>
    <div class="section mb">
      <div class="section__wrapper">
        <span>Цвет 1 </span>
      </div>

      <input v-model="color" type="color">
    </div>
    <div class="section">
      <div class="section__wrapper">
        <span>Цвет 2</span>
      </div>

      <input v-model="color2" type="color">
    </div>
    <HrBase />

    <h2 class="title">Помощь</h2>
    <div class="section mb">
      <div class="section__wrapper">
        <span>Если у вас баг:</span>
      </div>

      <ButtonBase @click="fixApp" :style="'danger'">Стереть данные</ButtonBase>
    </div>
    <div class="section">
      <div class="section__wrapper">
        <span>Если это не помогло:</span>
      </div>

      <ButtonBase @click="support" :style="'danger'">Написать нам</ButtonBase>
    </div>


    <HrBase />
    <span class="version">
      Timetable Herzen <br />
      1.1.1v</span>
  </div>
  <PaneBase v-model="isModalGroupOpen">
    <PaneGroup @close="isModalGroupOpen = false" />
  </PaneBase>
</template>

<script setup>
import { ref, watch } from "vue";
import { ButtonBase } from "@/shared/UI/ButtonBase";
import { HrBase } from "@/shared/UI/HrBase";
import { PaneBase } from "@/shared/UI/PaneBase";
import { SelectBase } from "@/shared/UI/SelectBase";
import { LS } from "@/shared/api";

import { PaneGroup } from "./components/PaneGroup";

import { useGroupStore } from "./model";

import { useStorage } from '@vueuse/core'

const isModalGroupOpen = ref(false);
const groupStore = useGroupStore();

const color = useStorage('color', '#262626')
const color2 = useStorage('color2', '#1c1c1c')

const TypesOfSlider = [
  {
    title: "Обычный",
    value: "fade",
  },
  {
    title: "Слайд",
    value: "slide",
  },

  {
    title: "Уменьшение",
    value: "grow-in",
  },
  {
    title: "Вырастание",
    value: "grow-out",
  },
];

const chooseSlider = (val) => {
  LS.set("slider", val);
  groupStore.sliderMode = val;
};

const fixApp = () => {
  const ok = confirm('У вас появился баг? Нажмите "ок" и мы перезапустим клиент')
  if (!ok) return

  localStorage.clear();
  location.reload()
}

const support = () => {
  window.open('https://t.me/dbais7')
}

watch(color, (val) => {
  document.body.style.setProperty('--color', val)
}, { immediate: true })

watch(color2, (val) => {
  document.body.style.setProperty('--color2', val)
}, { immediate: true })
</script>

<style lang="scss" scoped>
.title {
  color: #bdbdbd;
  font-weight: 400;
}

.version {
  display: block;
  text-align: center;
  padding-top: 10px;
}

.mb {
  margin-bottom: 15px;
}

.section {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__choose {
    font-weight: 700;
  }
}
</style>
