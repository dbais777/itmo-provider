<template>
  <template v-if="false">
    <Teleport to="#header">
      <div v-show="!isHidePanel">
        <input v-model="token" type="text" class="token" placeholder="token" />
        <input v-model="filterId" type="text" class="token" placeholder="filterby" />
      </div>
      <button class="btn" @click="isHidePanel = !isHidePanel">{{ isHidePanel ? 'Показать' : 'Скрыть' }}</button>
    </Teleport>
    <template v-if="!isLoading">
      <p class="comment" v-for="{ review, id } in filteredList">
      <div class="inner">

        <RaitingBase size="1" class="stars" disabled v-model="review.star" />
        <div class="comment__header">
          <div class="comment__name">{{ review.name }}</div>
          <div class="comment__date">{{ formatDate(review.date) }}</div>

        </div>
      </div>

      <p class="comment__text">
        {{ review.text }}
      </p>
      <div class="admin">
        id учителя: <button @click="filterId = id">{{ id }}</button>, id устройства: {{ }}
      </div>
      <div>
        <button @click="accept({ teacherid: id, revId: review.id })">Принять</button>
        <button @click="deleteRev({ teacherid: id, revId: review.id })">Удалить</button>
      </div>
      </p>
    </template>
    <template v-else>
      <div>
        <LoaderBase />
      </div>
    </template>
  </template>

  <img src="./assets/7y3tgicv0v4.jpg" class="me" alt="">
  <div class="btnwrap">
    <ButtonBase @click="openLink('https://vk.com/dbais')">
      Вконтакте
    </ButtonBase>
    <ButtonBase @click="openLink('https://t.me/dbais7')">
      Телеграмм
    </ButtonBase>
  </div>
</template>

<style scoped lang="scss">
.token {
  margin-bottom: 2px;
  width: 100%;
  padding: 10px;
  background: black;
  border: #3c3c3c;
  outline: none;
  border: none;
  color: #fff;
}

.me {
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  object-fit: cover;
}

.admin {
  margin-bottom: 10px;
}

.btn {
  display: block;
  width: 100%;
}

.btnwrap {
  display: grid;
  gap: 10px;
  padding: 10px;
}

.comment {
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .stars {
      margin-right: 10px;
    }
  }

  margin: 20px;
  margin-top: 0;
  padding-bottom: 20px;
  border-bottom: 0.5px solid #3c3c3c;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  &__name {
    margin-right: 10px;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { RaitingBase } from "@/shared/UI/RaitingBase";
import { ButtonBase } from "@/shared/UI/ButtonBase";
import { getCommentsAdmin, deleteReview, acceptReview } from './api'
import { LoaderBase } from '@/shared/UI/LoaderBase'
import { LS } from '@/shared/api'



const reviews = ref([])
const isHidePanel = ref(false)
const filterId = ref('')
const isLoading = ref(false)

const token = ref(LS.get('token'))

watch(token, async (val) => {
  LS.set('token', val)
  reviews.value = (await getCommentsAdmin(val))
})

const accept = async (obj) => {
  isLoading.value = true
  await acceptReview({ ...obj, token: token.value })
  reviews.value = [...(await getCommentsAdmin(token.value))]
  isLoading.value = false
}
const deleteRev = async (obj) => {
  isLoading.value = true
  await deleteReview({ ...obj, token: token.value })
  reviews.value = [...(await getCommentsAdmin(token.value))]
  isLoading.value = false
}

function formatDate(date) {
  date = new Date(date)
  const day = date.getDate();
  const month = date.getMonth() + 1; // добавляем 1, так как месяцы в JS начинаются с 0
  const year = date.getFullYear();

  // используем шаблон строки для форматирования даты
  const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year.toString()}`;

  return formattedDate;
}



const filteredList = computed(() => {
  if (!filterId.value) return reviews.value
  return reviews.value.filter((el) => el.id === filterId.value)
})


const init = async () => {

  reviews.value = (await getCommentsAdmin(token.value))
  console.log(reviews.value)
}

const openLink = (url) => {
  window.open(url)
}
onMounted(() => {
  init()
})
</script>
