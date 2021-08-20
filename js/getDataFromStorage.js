export class Storage{
    static getData(){
        const getData = localStorage.getItem("account")
        const parseData = JSON.parse(getData)
        return parseData
    }

    static setData(key,value){
        localStorage.setItem(key, JSON.stringify(value))
    }

    static removeData(key){
        localStorage.removeItem(key)
    }
}