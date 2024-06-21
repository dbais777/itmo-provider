<template>
  <div class="container">
    <PadBase class="c2">
      <div class="wrapper">
        <span class="text big">Пар нет</span>
        <span class="text">Отличный день,</span>
        <span class="text">чтобы {{ arraywithTemplates[randomIndex].text }}</span>
        <ImgNotLessons class="img" :img="arraywithTemplates[randomIndex].src" />
      </div>
    </PadBase>
  </div>
</template>

<script setup>
import PadBase from "../../shared/UI/PadBase/PadBase.vue";
import ImgNotLessons from "./assets/ImgNotLessons.vue";
const random = (max) => Math.floor(Math.random() * max);
const arraywithTemplates = [
  {
    src: "sleep",
    text: "поспать",
  },
  {
    src: "sing",
    text: "попеть",
  },
  {
    src: "cleaning",
    text: "прибраться",
  },
  {
    src: "meditate",
    text: "помедитировать",
  },
  // {
  //   src: "sex",
  //   text: "поспариваться",
  // },
  {
    src: "cooking",
    text: "поготовить",
  },
  // {
  //   src: "working",
  //   text: "поработать",
  // },
  // {
  //   src: "think",
  //   text: "подумать",
  // },
  // {
  //   src: "talking",
  //   text: "поботлать",
  // },
];

const randomIndex = random(arraywithTemplates.length);
</script>

<style scoped lang="scss">
.c2 {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 76%;
  width: 100%;
  background: var(--color2);
}

.container {
  height: 100%;
  display: flex;
  align-items: center;

}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  flex-direction: column;
}

.text {
  font-size: 30rem;
  text-align: center;
  letter-spacing: 0;

  &.big {
    font-size: 40rem;
    font-weight: 700;
    margin-bottom: 10px;
  }
}

.img {
  width: 150px;
  margin-top: 20px;
}
</style>
