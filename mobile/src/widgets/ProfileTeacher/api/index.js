import {ApiBase} from '@/shared/api'

export const getProfileById = async (id)=>{
    let response
    try {
         response = (await ApiBase.get('/teacher/', { params: { id } })).data
         console.log(response)
    } catch (error) {
        console.log(error)
    }

    return response
}


export const sendComment = async (par)=>{


    // text: '',
    // star: null,
    // name: '',
    // revId: '',

    let response
   
    try {
         response = (await ApiBase.post('/comment' , {  ...par })).data
        
    } catch (error) {
        console.log(error)
    }

    return response
}