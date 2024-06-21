import axios from 'axios'


const ApiBase = axios.create({
  baseURL: 'https://toxic777.ru/',
});

export {
  ApiBase
}