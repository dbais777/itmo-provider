import {ApiBase} from '@/shared/api'
import {flatObj} from './mappers'

export const getTeachers = async () =>  {
    let response
    try {
         response = flatObj((await ApiBase.get('/teachers')).data)
    } catch (error) {
        console.log(error)
    }

    return response
    }