import { Fetch } from "./fetches.js"

const list = document.querySelector(".users-list")

const urlData = new URLSearchParams(window.location.search)
const id = urlData.get("postId")

async function getNames() {
    const usersLike = await Fetch.get(`likes?postId=${id}&_expand=user`)
    console.log(usersLike)
    list.innerHTML = ""
    for (let i = 0; i < usersLike.length; i++) {
        const elem = document.createElement("li")
        elem.innerHTML = `${usersLike[i].user.name} ${usersLike[i].user.surname}`
        list.appendChild(elem)
    }
}

getNames()