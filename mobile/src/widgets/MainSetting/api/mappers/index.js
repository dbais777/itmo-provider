import moment from "moment";

const getCurrentTime = () => {
  return (new Date(new Date().getTime())).toLocaleDateString().replaceAll('.', '-')
}

export const getAllDaysWithLessons = async (days) => {

  const start = moment(getCurrentTime(), "DD-MM-YYYY").subtract(40, 'days')
  const end = moment(getCurrentTime(), "DD-MM-YYYY").add(90, 'days');

  const formatResponse = days.map((el) => {
    return { time: moment(el.time - 10800000), ...el.subjects };
  })
  let allDaysWithLessons = [];
  let idx = 0;
  while (start < end) {
    let lessonForDay = formatResponse.find((el) => el.time.isSame(start));

    const oneDayWithLesson = {
      time: start.clone(),
      idx,
      lessons: null,
    };
    if (lessonForDay) {
      //если день с уроками совпал с днем для календаря, добавляем
      oneDayWithLesson.lessons = lessonForDay;
    }
    allDaysWithLessons.push(oneDayWithLesson);
    start.add(1, "day");
    idx++;
  }
  const resultWithoutDates = allDaysWithLessons.map((el) => {
    if (el?.lessons?.time) {
      delete el?.lessons?.time;
      el.lessons = Object.values(el.lessons);
    }
    return el;
  });

  return resultWithoutDates;
};