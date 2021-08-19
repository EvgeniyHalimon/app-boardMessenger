import { Fetch } from "./fetches.js"

const formList = document.querySelector(".form-list")
const firstName = document.querySelector("#first_name")
const lastName = document.querySelector("#last_name")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const passwordRepeat = document.querySelector("#repeat_password")

formList.addEventListener("submit", (e) => {
    e.preventDefault()
    getDataFromLocalhost()
})

function find(data) {
    if(data.length > 0){
        alert("This email has already exist")
        return
    } 
    if(data.length == 0 && password.value === passwordRepeat.value){
        const body = {
            name: firstName.value,
            surname: lastName.value,
            email: email.value,
            password: password.value,
        }
        Fetch.post("users", body)
    } else if(password.value !== passwordRepeat.value){
        alert("Password mismatch")
        return
    } 
    document.location.href="../html/login.html" 
}

async function getDataFromLocalhost() {
    const res = await Fetch.get(`users?email=${email.value}`)
    find(res)
}