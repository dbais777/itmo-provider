<template>
  <div v-if="!isLoading">
    <div class="wrapper" v-bind="containerProps">
      <!-- <pre>{{ JSON.stringify(myTeachers, true, 2) }}</pre> -->

      <div class="list" v-bind="wrapperProps">
        <div class="item" :key="index" v-for="{ index, data } in list">
          <span class="name">{{ data.name }}</span>

          <div @click="saveId(index, data.id)">
            <ButtonBase>Перейти</ButtonBase>
          </div>
        </div>
      </div>

      <div class="no-found" v-if="list.length === 0">
        К сожалению, никто не найден
      </div>
    </div>
    <Teleport to="#header">
      <InputBase placeholder="Для поиска начните вводить ФИО" v-model.trim="searchInput" />
    </Teleport>
  </div>
  <div v-else class="loading">
    <LoaderBase />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LoaderBase } from '@/shared/UI/LoaderBase'
import { InputBase } from "@/shared/UI/InputBase";
import { getTeachers } from "./api";
import { ButtonBase } from "@/shared/UI/ButtonBase";

import { useVirtualList } from "@vueuse/core";

import { useGroupStore } from "@/widgets/MainSetting";

const isLoading = ref(false)

const router = useRouter();
const route = useRoute();

const groupStore = useGroupStore();

const teachers = ref([]);

const searchInput = ref(route.query.search ?? "");

const searchedTeachers = computed(() => {
  return teachers.value.filter((el) =>
    el.name.trim().toUpperCase().includes(searchInput.value.toUpperCase())
  );
});

const saveId = async (key, idx) => {
  await router.push({ path: "/teachers", query: { ...route.query, id: key } });
  router.push({ path: "/teachers/" + idx });
};

watch(searchInput, (val) => {
  router.push({ path: "/teachers", query: { ...route.query, search: val } });

  if (val.toLocaleLowerCase() === "admin") router.push("/admin");
});

watch(searchedTeachers, () => {
  scrollTo(0);
});

const myTeachers = computed(() => {
  //сделать фильтрацию по своим преподам
  return groupStore;
});

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  searchedTeachers,
  {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 53,
  }
);

const init = async () => {
  isLoading.value = true
  teachers.value = await getTeachers();
  setTimeout(() => {
    scrollTo(route.query.id ?? 1);
  });
  isLoading.value = false
};

onMounted(() => {
  init();
});
</script>

<style scoped lang="scss">
.item {
  justify-content: space-between;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  border-bottom: 0.5px solid #3c3c3c;
  padding-bottom: 20px;
  height: 54px;

  &:last-child {
    border-bottom: none;
  }
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.no-found {
  font-size: 20rem;
}

.wrapper {
  padding: 20px;
  height: 100%;
}

.name {
  margin-right: 20px;
}
</style>
