import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"
import printFeed from "./printPost.js"

const h2 = document.querySelector("h2")
h2.addEventListener("click", () => {
    location.href = "../html/app.html"
})
const feedList = document.querySelector(".feed")

const account = Storage.getData("account") 

const select = document.querySelector("select")
const selectBtn = document.querySelector(".select-btn")
const pagesList = document.querySelector(".pages")

getFeed()
async function getFeed(){
    const posts = await Fetch.get("posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc")
    printFeed(posts,feedList,account)
}

selectBtn.addEventListener("click", async () => {
    const getLength = await Fetch.get("posts")
    const getFirstPage = await Fetch.get(`posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc&_page=1&_limit=${select.value}`) 
    printFeed(getFirstPage,feedList,account)
    const pageQua = Math.ceil(getLength.length / select.value)
    pagesList.innerHTML = ""
    for (let i = 0; i < pageQua; i++) {
        const elem = document.createElement("li")
        const page = document.createElement("button")
        page.classList.add("pages-elem")
        page.id = i + 1
        if(page.id == 1){
            page.classList.add("page-active")
        }
        console.log()
        page.addEventListener("click", async (e) => {
            const pageActive = document.querySelector(".page-active")
            e.currentTarget.classList.add("page-active")
            pageActive.classList.remove("page-active")
            const getPage = await Fetch.get(`posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc&_page=${page.id}&_limit=${select.value}`)
            printFeed(getPage,feedList,account)
        })
        
        page.innerHTML = i + 1
        elem.appendChild(page)
        pagesList.appendChild(elem)
    }
})





