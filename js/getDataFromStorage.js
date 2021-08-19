export class GetData{
    static getDataFromStorage(arr){
        const getData = localStorage.getItem("account")
        const parseData = JSON.parse(getData)
        return parseData
    }
}