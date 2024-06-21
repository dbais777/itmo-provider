import { ApiBase } from "@/shared/api"
export const getFillials =async ()=> (await ApiBase.get('/fillials')).data

export const getGroupsTypes =async (id)=> (await ApiBase.post('/groups-type', {id})).data


export const getGroupsCourses = async (id, type)=> ((await ApiBase.post('/groups-courses', {id, type})).data[0].courses.sort())

export const getGroups = async (id, type, course)=>  (await ApiBase.post("/groups", {
    id,
    type,
    course,
})).data