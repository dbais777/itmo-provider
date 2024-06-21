const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { v4: uuidv4 } = require("uuid");
const link = "https://guide.herzen.spb.ru/static/schedule.php";
const { timeOutCallback } = require("../helpers/index");
const { Group } = require("../models/group");
const { Lesson } = require("../models/lesson");
const mongoose = require("mongoose");


function getMonthAgoDateString() {
  let today = new Date(); // получаем текущую дату
  let monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // отнимаем месяц от текущей даты

  // преобразуем даты в нужный формат
  let dateStringToday = today.toISOString().slice(0, 10);
  let dateStringMonthAgo = monthAgo.toISOString().slice(0, 10);

  // формируем строку с результатом
  let resultString = `&date1=${dateStringMonthAgo}`;

  return resultString; // возвращаем строку с результатом
}

const fetchPage = async () => {
  const dataParsing = [];
  const response = await axios.get(link);
  const DOM = new JSDOM(response.data);
  const fillials = DOM.window.document.querySelectorAll("h3");

  fillials.forEach((el) => {
    if (el.nextElementSibling) {
      const fillialTitle = el.textContent;

      let helper = [];
      el.nextElementSibling.querySelectorAll("li").forEach((el) => {
        const text = el.textContent;
        let [type, course] = text.split(", ");
        type = type.trim();
        course = Number(course.replace(/[^+\d]/g, "").trim());
        const groupTitle = text
          .substring(text.indexOf("группа"), text.indexOf("семестр") - 2)
          .trim();

        const fullLink = Array.from(el.querySelectorAll("button"))
          .filter(
            (el) =>
              el.textContent.includes("семестр") &&
              el.style.visibility !== "hidden"
          )[0]
          .attributes.onclick.textContent.split("'")[1];
        const link = fullLink
          .substr(fullLink.indexOf("group=") + 6)
          .split("&")[0]
          .trim();

        helper.push({
          type,
          course,
          link,
          groupTitle,
          groupId: uuidv4(),
        });
      });

      dataParsing.push({
        title: fillialTitle,
        groups: helper,
      });
      helper = [];
    }
  });

  await Group.deleteMany({})
  await Group.create(dataParsing)
};

const fetchAllTimetables = async () => {
  const groupIds = await Group.distinct("groups.link");
  await (mongoose.connection.db.dropCollection('lessons'))
  await (mongoose.connection.db.createCollection('lessons'))

  timeOutCallback(0, groupIds.length - 1, async (step) => {
    try {
      const res = await parserTimetable(groupIds[step]);
      res._id = groupIds[step];
      Lesson.create({ groupId: groupIds[step], days: res });
      console.log(
        groupIds[step] +
        "   " +
        new Date().toLocaleString() +
        " |  " +
        ((step / groupIds.length) * 100).toFixed(2)
      );
    } catch (error) {
      console.log("Замечена ошибка на " + groupIds[step], error);
    }
  });
};

const parserTimetable = async (groupId) => {

  const response = await axios.get(
    "https://guide.herzen.spb.ru/static/schedule_dates.php?" + "id_group=" + groupId
  );

  const DOM = new JSDOM(response.data);

  const result = [];
  const mainTable = DOM.window.document.querySelector(
    ".schedule tbody:nth-child(2)"
  );
  const rowTimings = mainTable.querySelectorAll("tr:not(.lowline)");

  let formatTiming = (rowTimingEl) => {
    const arrayFromDate = rowTimingEl.textContent.split(",")[0].split(".");
    const prettyTime = new Date(
      [arrayFromDate[1], arrayFromDate[0], arrayFromDate[2]].join(".")
    );

    return prettyTime.getTime();
  };

  let formattedData = (raw) => {
    const result = {};
    if (raw.childNodes.length === 1) return null;
    const text = raw.textContent;
    const type = text.substring(text.indexOf("[") + 1, text.indexOf("]")); // лаб

    const teacher = raw?.querySelector("* + a")?.textContent; 
    const linkTeacher = raw?.querySelector("* + a")?.href?.split('id=')[1]
    const rawLinkId = raw.querySelector("strong a")?.href;
    const title = raw.querySelector("strong").textContent;

    let id = null;
    if (rawLinkId) {
      id = rawLinkId.substring(rawLinkId.indexOf("id=") + 3);
    }

    const placeText = raw.lastChild.textContent.substring("1")?.trim();
    let place;
    if (placeText.indexOf("Видеолекция") !== -1) {
      place = placeText.substring(placeText.indexOf("Видеолекция"));
    } else place = placeText;
    result.type = type;
    result.teacher = teacher?.trim();
    result.linkTeacher = linkTeacher ?? ''
    result.place = place;
    result.lesson = { title, id };
    
    return result;
  };

  let parse = (row) => {
    let result = {};
    
    const [startTime, endTime] = row
      .querySelector("th")
      .textContent.split("—")
      .map((el) => el.trim());

    const childrens = row.querySelectorAll("td");

    if (childrens.length === 1) {
      result.first = formattedData(childrens[0]);
      result.second = formattedData(childrens[0]);
      result.first.time = { startTime, endTime };
      result.second.time = { startTime, endTime };
    } else {
      result.first = formattedData(childrens[0]);
      result.second = formattedData(childrens[1]);
      result.first = { ...result.first, time: { startTime, endTime } };
      result.second = { ...result.second, time: { startTime, endTime } };
    }

    return result;
  };

  const findRowSubjects = (elem) => {
    const elements = [];
    while (
      elem.nextElementSibling?.classList.contains("lowline") &&
      elem.nextElementSibling
    ) {
      elements.push(elem.nextElementSibling);
      elem = elem.nextElementSibling;
    }
    return elements;
  };

  rowTimings.forEach((el) => {
    const day = {};
    day.time = formatTiming(el);
    day.subjects = findRowSubjects(el).map((el) => parse(el));
    result.push(day);
  });

  return result;
};

module.exports = { fetchPage, fetchAllTimetables, parserTimetable };
