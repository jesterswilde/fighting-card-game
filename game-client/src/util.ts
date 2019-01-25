
let uuid = 0; 
export const getUUID = (obj: {[index: string]: any})=>{
    if(obj.uuid === undefined){
        obj.uuid = uuid; 
        uuid++; 
    }
    return obj.uuid; 
}