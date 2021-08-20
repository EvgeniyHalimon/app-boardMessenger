export class Fetch{
    static get(url){
        return fetch(`http://localhost:3000/${url}`)
        .then(response => response.json())
    }

    static post(url,body){
        return fetch(`http://localhost:3000/${url}`,{
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static patch(url,body){
        return fetch(`http://localhost:3000/${url}`,{
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}