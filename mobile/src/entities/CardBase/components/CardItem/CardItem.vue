<template>
  <template v-if="lesson.min">
    <div class="coffee-time">
      Перерыв
      {{ formatTime(lesson.min) }}
      <img class="coffee" src="../../assets/coffee.svg" />
    </div>
  </template>
  <div v-else class="lesson">
    <div class="left">
      <div class="header">
        <div class="counter">{{ lesson.key + 1 }}</div>
        <div class="type">{{ lesson.type }}</div>
      </div>

      <a @click="openCourse(lesson.lesson)" class="title">{{
        lesson.lesson?.title
      }}</a>
      <router-link :to="'teachers/' + lesson.linkTeacher" class="teacher">{{
        lesson.teacher
      }}</router-link>
      <div class="place">{{ lesson.place }}</div>
    </div>
    <div class="right">
      {{ lesson.time?.startTime }} - {{ lesson.time?.endTime }}
    </div>
  </div>
</template>

<script setup>
import { Browser } from "@capacitor/browser";
15970;
const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const openCourse = async ({ id }) => {
  if (!id) return;
  await Browser.open({
    url: "https://moodle.herzen.spb.ru/enrol/index.php?id=" + id,
  });
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;

  // Функция для получения правильной формы слова в зависимости от числа
  function pluralize(num, one, two, five) {
    if (num % 10 === 1 && num % 100 !== 11) {
      return one;
    } else if (
      num % 10 >= 2 &&
      num % 10 <= 4 &&
      (num % 100 < 10 || num % 100 >= 20)
    ) {
      return two;
    } else {
      return five;
    }
  }

  // Получаем правильную форму для часов и минут
  const hoursString = pluralize(hours, "час", "часа", "часов");
  const minutesString = pluralize(
    remainderMinutes,
    "минута",
    "минуты",
    "минут"
  );

  // Собираем строку и возвращаем результат
  if (hours === 0) {
    return `${remainderMinutes} ${minutesString}`;
  } else if (remainderMinutes === 0) {
    return `${hours} ${hoursString}`;
  } else {
    return `${hours} ${hoursString} ${remainderMinutes} ${minutesString}`;
  }
};
</script>

<style scoped>
.coffee-time {
  text-align: center;
  font-size: 16rem;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 30px;
  padding-bottom: 30px px;
}

.coffee {
  width: 40px;
  margin-left: 20px;
  transform: translateY(-3px);
}

.lesson {
  display: flex;
  justify-content: space-between;
}

.left {
  flex: 0 1 auto;
}

.right {
  white-space: nowrap;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.counter {
  border-radius: 50%;
  background: #fff;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #000;
  font-weight: 500;
}

.title {
  color: #fff;
  font-size: 16rem;
  font-weight: 600;

  display: block;
}

.teacher {
  font-size: 14rem;
  display: block;
  margin-bottom: 10px;
}

.place {
  color: #dbdada;
}
</style>
