import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"
import printFeed from "./printPost.js"

const textarea = document.querySelector("textarea")
const postBtn = document.querySelector("#submit-btn")
const postList = document.querySelector(".posts")
const board = document.querySelector("h2")
board.addEventListener("click", () => {
    location.href = "../html/main-board.html"
})

const account = Storage.getData("account") 

getFeed()
async function getFeed(){
    const posts = await Fetch.get(`posts?userId=${account}&_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc`)
    printFeed(posts,postList,account,getFeed)
}

postBtn.addEventListener("click", async () => {
    const body = {
        post: textarea.value,
        userId: account,
        likeQuantity: 0,
        date: new Date().toLocaleDateString(),
        hours: new Date().toLocaleTimeString().slice(0,-3)
    }
    await Fetch.post("posts", body)
    const posts = await Fetch.get(`posts?userId=${account}&_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc`)
    printFeed(posts,postList,account,getFeed)
    textarea.value = ""
})

const logout = document.querySelector(".logout")
logout.addEventListener("submit", (e) => {
    e.preventDefault()
    Storage.removeData("account")
    document.location.href="../html/login.html"
})