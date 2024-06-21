<template>
  <Teleport to="#header">
    <div @click="goBack" class="back">Назад</div>
  </Teleport>
  <ProfileTeacher />
</template>

<script setup>
import { useRouter } from "vue-router";
import { ProfileTeacher } from "@/widgets/ProfileTeacher";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.back {
  padding: 20px;
  font-size: 20rem;
}
</style>
