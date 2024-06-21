const axios = require("axios");
const fs = require("fs");
ObjectId = require("mongodb").ObjectId;
const link = 'https://atlas.herzen.spb.ru/prof.php'

const { timeOutCallback } = require("../helpers/index");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { Teacher } = require("../models/teacher");

const pages = 21

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

const getListTeachers = async () => {
    await Teacher.deleteMany({})
    const dataParsing = [];
    for (let i = 1; i <= pages; i++) {

        const response = await axios.get(link + '?PAGE=' + i);
        const DOM = new JSDOM(response.data);



        DOM.window.document.querySelectorAll('.table_good a').forEach(el => {
            dataParsing.push(el.href.split('=')[1])
        })

    }

    const errs = []
    timeOutCallback(0, dataParsing.length - 1, async (step) => {

        try {
            const res = await getOneTeacher(dataParsing[step])
            Teacher.create({ teacher: { ...res, id: dataParsing[step] } });

            console.log(
                dataParsing[step] +
                "   " +
                new Date().toLocaleString() +
                " |  " +
                ((step / dataParsing.length) * 100).toFixed(2)
            );

        } catch (e) {
            console.log(dataParsing[step], e, 'ere2')
            errs.push(dataParsing[step])
            return
        }

        if (step === dataParsing.length - 2) {
            fs.writeFileSync("errors", JSON.stringify(errs));
        }

    }, 3000)

}

const getOneTeacher = async (id) => {
    const link = 'https://atlas.herzen.spb.ru/teacher.php?id='
    const response = await axios.get(link + id);
    const DOM = new JSDOM(response.data);

    const prof = DOM.window.document.querySelector('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td.body > div  h3 .text').textContent
    const name = DOM.window.document.querySelector('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td.body > div  h3').textContent.replace(prof, '')

    const info = []
    DOM.window.document.querySelectorAll('.mm').forEach(el => {
        info.push({
            title: el.textContent.replaceAll('\n', ''),
            text: el.nextElementSibling.textContent.replaceAll('\n', ''),
        })

    })

    let photoLink = DOM.window.document.querySelector('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td.body > div > img').src

    const convertPhoto = async () => {
        if (photoLink.includes('1680331724')) {
            photoLink = null
            return
        }
        if (photoLink.length < 500) {
            toDataURL(photoLink, (res) => photoLink = res)
            return
        }
    }
    await convertPhoto(photoLink)



    return {
        photo: photoLink,
        info,
        prof,
        name
    }

}

module.exports = { getListTeachers }
