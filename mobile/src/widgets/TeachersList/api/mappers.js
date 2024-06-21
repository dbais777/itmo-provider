export const flatObj = (arr) =>{
   for (let i=0;i<arr.length;i++) {
    arr[i] = {...arr[i].teacher}
   }
   return arr
}