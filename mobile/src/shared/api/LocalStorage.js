export const LS  = {
    get: (key)=> JSON.parse(localStorage.getItem(String(key))),
    set: (key,item)=> localStorage.setItem(String(key),JSON.stringify(item))
}