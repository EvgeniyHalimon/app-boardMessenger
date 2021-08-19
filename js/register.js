import { Fetch } from "./fetches.js"

const formList = document.querySelector(".form-list")
const firstName = document.querySelector("#first_name")
const lastName = document.querySelector("#last_name")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const passwordRepeat = document.querySelector("#repeat_password")

formList.addEventListener("submit", test)

async function test(e) {
    e.preventDefault()
    const res = await Fetch.get(`users?email=${email.value}`)
    if(res.length > 0){
        return alert("User with this email has already exist")
    } 
    if(password.value !== passwordRepeat.value){
        return alert("Password mismatch")
    } 
    const body = {
        name: firstName.value,
        surname: lastName.value,
        email: email.value,
        password: password.value,
    }
    Fetch.post("users", body)
    document.location.href="../html/login.html"
}