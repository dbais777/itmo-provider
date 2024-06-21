<template>
  <template v-if="isLoading">
    <SkeletonBase v-for="item in 2" />
  </template>

  <template v-else-if="step === 0">
    <div class="items" v-for="item in items">
      <span class="items__title">
        {{ item.title }}
      </span>
      <ButtonBase @click="chooseId(item)">Выбрать</ButtonBase>
    </div>
  </template>

  <template v-else-if="step === 1">
    <div class="items" v-for="item in items">
      <span class="items__title">
        {{ item }}
      </span>
      <ButtonBase @click="chooseGroupType(item)">Выбрать</ButtonBase>
    </div>
  </template>

  <template v-else-if="step === 2">
    <div class="items" v-for="item in items">
      <span class="items__title"> {{ item }} курс </span>
      <ButtonBase @click="chooseGroup(item)">Выбрать</ButtonBase>
    </div>
  </template>

  <template v-else-if="step === 3">
    <div class="items" v-for="item in items">
      <span class="items__title"> {{ item.groupTitle }} </span>
      <ButtonBase @click="finalChoose(item)">Выбрать</ButtonBase>
    </div>
  </template>

  <template v-else-if="step === 4">
    <div class="items" v-for="item in items">
      <span class="items__title"> {{ item.title }} </span>
      <ButtonBase @click="chooseSubGroup(item.value)">Выбрать</ButtonBase>
    </div>
  </template>
</template>

<script setup>
import { ref } from "vue";
import { SkeletonBase } from "@/shared/UI/SkeletonBase";
import { ButtonBase } from "@/shared/UI/ButtonBase";

import { LS } from "@/shared/api";

import { useGroupStore } from "../../model";

import {
  getFillials,
  getGroupsTypes,
  getGroupsCourses,
  getGroups,
} from "./api";

const emit = defineEmits(["close"]);

const groupStore = useGroupStore();

const isLoading = ref(true);
const step = ref(0);
const items = ref([]);

let choosedId = null;

const init = async () => {
  items.value = await getFillials();
  isLoading.value = false;
};

//step 1
let id;

const chooseId = async ({ _id }) => {
  isLoading.value = true;
  id = _id;
  step.value = 1;
  items.value = await getGroupsTypes(id);

  isLoading.value = false;
};

//step 2
let groupType;

const chooseGroupType = async (gType) => {
  isLoading.value = true;

  groupType = gType;
  step.value = 2;
  items.value = await getGroupsCourses(id, groupType);
  isLoading.value = false;
};

let group;

const chooseGroup = async (cGroup) => {
  isLoading.value = true;

  group = cGroup;
  step.value = 3;

  items.value = await getGroups(id, groupType, group);
  isLoading.value = false;
};

const finalChoose = async ({ groupTitle, link }) => {
  await LS.set("course", { groupTitle, link });
  groupStore.groupInfo = { groupTitle, link };

  step.value = 4;
  items.value = [
    {
      title: "Нет подгрупп",
      value: 0,
    },
    {
      title: "Первая подгруппа",
      value: 1,
    },
    {
      title: "Вторая подгруппа",
      value: 2,
    },
  ];
};

const chooseSubGroup = (val) => {
  LS.set("subgroup", val);
  groupStore.subgroup = val;
  emit("close");
};

init();
</script>

<style scoped lang="scss">
.items {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 0.5px solid #3c3c3c;

  &:last-child {
    border-bottom: none;
  }
}

.items__title {
  margin-right: 20px;
}
</style>
