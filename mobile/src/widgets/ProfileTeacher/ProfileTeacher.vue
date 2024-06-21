<template>
  <div class="container" v-if="!isLoading">
    <div v-if="person" class="wrapper">
      <img class="img" v-if="person.teacher.photo" :src="person.teacher.photo" />
      <img v-else src="./assets/no-photo.png" class="img" />
      <span class="name">{{ person.teacher.name }}</span>
      <!-- <TabsBase class="tabs" :tabs="tabs" @chooseTab="chooseTab" /> -->
      <template v-if="currentTab === 0">
        <div class="item" v-for="item in person.teacher.info">
          <div class="item__title">{{ item.title }}</div>
          <div class="item__info">{{ item.text }}</div>
        </div>
      </template>
      <template v-if="currentTab === 1">
        <div v-if="person.teacher?.reviews?.length === 0" style="margin: 20px;">
          Отзывов еще нет ;(
          <br>
          Добавьте первый!
        </div>
        <template v-else>
          <div class="reviews__title">Средняя оценка</div>
          <div class="avg">{{ (sum / globalValue).toFixed(2) }}/5</div>

          <div class="reviews__title">Отзывы студентов</div>

          <div class="reviews__stars" v-for="star in stars">
            <div class="reviews__item">
              <span class="text">
                {{ star.value }} {{ wordFormat[star.value] }}
              </span>
              <RaitingBase disabled v-model="star.value" />
            </div>
            <div class="percent">{{ star.count }} ({{ Math.floor((star.count / globalValue) * 100) }}%)</div>
          </div>

          <div class="reviews__title">Комментарии</div>




          <p class="comment" v-for="review in person.teacher.reviews.slice(-2)">
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
          </p>


          <ButtonBase @click="isModalGroupOpen = true" class="btn"> Смотреть все </ButtonBase>
        </template>

        <template v-if="isSended && canComment">
          <div class="reviews__title">Оставить отзыв</div>
          <div class="yname">
            <div class="anon">
              <div class="title">Введите имя</div>
              <div class="inner">
                <span class="anon__title">
                  Анон
                </span>
                <SwitchBase v-model="isAnon" />
              </div>
            </div>
            <InputBase maxlength="20" :disabled="isAnon" v-model="review.name" placeholder="Ваше имя"
              class="yname__input" />
          </div>
          <div class="rait">
            <span class="rait__title">Оцените</span>
            <RaitingBase size="2.6" v-model="review.star" />
          </div>

          <div class="rait ycom">
            <span class="rait__title">Расскажите</span>
            <span>{{ review.text.length }}/600</span>
          </div>
          <div class="ta__inner">
            <textarea v-model="review.text" maxlength="600" placeholder="600 символов максимум" class="ta" cols="30"
              rows="7"></textarea>
          </div>
          <ButtonBase class="btn" @click="sendComment">Отправить отзыв</ButtonBase>
        </template>
        <template v-if="!canComment">
          <div class="reviews__title">Оставлять отзыв <br /> можно раз в день</div>
        </template>
      </template>
    </div>
  </div>
  <div v-else class="loading">
    <LoaderBase />
  </div>
  <PaneBase v-model="isModalGroupOpen">
    <p class="comment" v-for="review in person.teacher.reviews">
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
    </p>



  </PaneBase>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { TabsBase } from "@/shared/UI/TabsBase";
import { useRoute } from "vue-router";
import { getProfileById, sendComment as sendCommentApi } from "./api";
import { RaitingBase } from "@/shared/UI/RaitingBase";
import { ButtonBase } from "@/shared/UI/ButtonBase";
import { InputBase } from '@/shared/UI/InputBase'
import { SwitchBase } from "@/shared/UI/SwitchBase";
import { PaneBase } from "@/shared/UI/PaneBase";
import { LoaderBase } from '@/shared/UI/LoaderBase'
import { createToaster } from "@meforma/vue-toaster";
import { LS } from "@/shared/api";

const canComment = computed(() => {
  if (!LS.get('timeout')) return true
  return 86400000 < ((new Date).getTime() - LS.get('timeout'))
})

const isLoading = ref(false)
const isModalGroupOpen = ref(false)

const toaster = createToaster({ position: 'top' });
const route = useRoute()


const isAnon = ref(false)

const review = ref({
  text: '',
  star: null,
  name: '',
})

const isSended = ref(true)

const sendComment = async () => {

  if (!Object.values(review.value).every((el) => el)) {
    toaster.show(`Пожалуйста, заполните все поля`);
    return
  }
  const id = (route.params.id)
  await sendCommentApi({ ...review.value, revId: id })
  isSended.value = false
  toaster.show(`Отзыв успешно отправлен на модерацию`);
  LS.set('timeout', (new Date).getTime())

}

watch(isAnon, (val) => {
  if (val) {
    review.value.name = 'Анонимус'
    return
  }
  if (!val) {
    review.value.name = ''
    return
  }
})
// toaster.show(`Hey! I'm here`);



function formatDate(date) {
  date = new Date(date)
  const day = date.getDate();
  const month = date.getMonth() + 1; // добавляем 1, так как месяцы в JS начинаются с 0
  const year = date.getFullYear();

  // используем шаблон строки для форматирования даты
  const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year.toString()}`;

  return formattedDate;
}

const test = ref(3);
const val = ref(0)

let globalValue = ref(0)
let sum = ref(0)

const stars = computed(() => {
  const result = {}


  person.value.teacher.reviews.forEach(({ star }, idx) => {
    globalValue.value++

    sum.value += Number(star)

    if (!result[star]) result[star] = 0
    result[star] += 1

  })

  return (Object.entries(result).map(el => {
    return {
      count: el[1],
      value: el[0]
    }
  })).sort((a, b) => b.count - a.count)

})

const currentTab = ref(0);
const tabs = [
  {
    title: "Информация",
    id: 0,
  },
  {
    title: "Отзывы",
    id: 1,
  },
];

const chooseTab = ({ id }) => {
  currentTab.value = id;
};

const wordFormat = {
  0: "звёзд",
  1: "звезда",
  2: "звезды",
  3: "звезды",
  4: "звезды",
  5: "звёзд",
};


const person = ref(null);

const init = async () => {
  isLoading.value = true
  person.value = await getProfileById(route.params.id);
  isLoading.value = false

};

onMounted(() => {
  init();
});
</script>

<style  scoped lang="scss">
.avg {
  text-align: center;
  font-size: 50rem;
  font-weight: 700;
}

.ycom {
  display: flex;
  align-items: center;
}

.rait {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  margin-top: 20px;

  &__title {
    font-size: 24rem;
    margin-right: 20px;
  }
}

.btn {
  margin: 0 20px;
  margin-bottom: 30px;
}

.yname {
  margin: 0 10px;

  &__input {
    padding: 0;
  }

  &__title {
    font-size: 20rem;
  }
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.anon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .inner {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 24rem;
  }

  &__title {
    font-size: 20rem;
    margin-right: 10px;
  }
}

.ta {
  width: 100%;
  resize: none;

  font-size: 20rem;
  border-radius: 10px;
  padding: 10px 20px;
  outline: none;
  background-color: #424242;
  border: none;
  color: #fff;

  &__inner {
    padding: 20px;
  }
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

.text {
  font-size: 25rem;
  margin-right: 10px;
  min-width: 100px;
}

.percent {
  font-size: 25rem;
}

.reviews {
  &__title {
    text-align: center;
    font-size: 30rem;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  &__item {
    display: flex;
    align-items: center;
  }

  &__stars {
    display: flex;
    align-items: center;
    margin: 0 20px;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 0.5px solid #3c3c3c;
    padding-bottom: 10px;

    &:last-child {
      border-bottom: none;
    }
  }
}

.img {
  border-radius: 20px;
  border: 4px solid;
  width: 60vw;
  margin: 20px auto;
}

.tabs {
  margin: 10px;
  margin-bottom: 10px;
}

.item {
  font-size: 20rem;

  padding-bottom: 30px;
  border-bottom: 0.5px solid #3c3c3c;

  &:last-child {
    border-bottom: none;
  }

  margin: 20px;
}

.item__title {
  font-weight: bold;
  font-size: 24rem;
  margin-bottom: 10px;
}

.name {
  display: block;
  text-align: center;
  font-size: 40rem;
  max-width: 100%;
  margin-bottom: 30px;
  padding: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wrapper {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
</style>
