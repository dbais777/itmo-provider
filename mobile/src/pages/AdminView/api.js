import {ApiBase} from '@/shared/api'

export const getCommentsAdmin = async (token)=>{
    let response
    try {
         response = (await ApiBase.post('/admin/',{ token})).data
         
    } catch (error) {
        console.log(error)
    }

    return response
}


export const deleteReview = async (data)=>{
    console.log(data)
    let response
    try {
         response = (await ApiBase.post('/delete',{ data})).data
         
    } catch (error) {
        console.log(error)
    }

    return response
}

export const acceptReview = async (data)=>{
    console.log(data)
    let response
    try {
         response = (await ApiBase.post('/accept',{ data})).data
         
    } catch (error) {
        console.log(error)
    }

    return response
}