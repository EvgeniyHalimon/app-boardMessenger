export class Fetch{
    static get(data){
        return fetch(`http://localhost:3000/${data}`)
        .then(response => response.json())
        .then(data =>{
            return data
        })
    }

    static post(data,body){
        return fetch(`http://localhost:3000/${data}`,{
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static patch(data,body){
        return fetch(`http://localhost:3000/${data}`,{
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}