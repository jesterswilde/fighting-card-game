import { filterIfHas } from "./utils";

describe("util",()=>{
    describe("filterIfHas",()=>{
        it("should return the original array if it doesn't contain the value",()=>{
            const arr = [1,2,3];

            const result = filterIfHas(arr, 4); 

            expect(result).toBe(arr); 
        })
        it("should return a filtered, new array, if the value was found",()=>{
            const arr = [1,2,3]; 

            const result = filterIfHas(arr, 3); 

            expect(result).not.toBe(arr); 
            expect(result.indexOf(3)).toBe(-1); 
        })
        it("should work if passed undefined", ()=>{
            const result = filterIfHas(undefined, 4); 

            expect(result).not.toBeUndefined(); 
            expect(Array.isArray(result))
        })
    })
})