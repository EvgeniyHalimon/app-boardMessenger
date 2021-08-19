import { Fetch } from "./fetches.js"

const loginForm = document.querySelector(".login-form")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    getUser()
})

function findUser(data) {
    if(data[0].password !== loginPassword.value){
        alert("Wrong password")
        return
    }
    if(data.length > 0){
        document.location.href="../html/app.html"  
    } else{
        alert("This user doesnt exist or wrong email")
        return 
    }
    localStorage.setItem("account", JSON.stringify(data))
}

async function getUser() {
    const res = await Fetch.get(`users?email=${loginEmail.value}`)
    findUser(res)
}