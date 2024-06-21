import { ApiBase } from '@/shared/api'
import { getAllDaysWithLessons } from './mappers'

export const getDays = async (link) => {
    const days = (await ApiBase.get('/lessons/' + link))?.data[0]?.days

    console.log(days)
    const response = await getAllDaysWithLessons(days)
    console.log(response, 777)


    return response
}