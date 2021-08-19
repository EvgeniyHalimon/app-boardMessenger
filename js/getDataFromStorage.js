export class Storage{
    static getData(){
        const getData = localStorage.getItem("account")
        const parseData = JSON.parse(getData)
        return parseData
    }

    static setData(string,data){
        localStorage.setItem(string, JSON.stringify(data))
    }

    static removeData(string){
        localStorage.removeItem(string)
    }
}