import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"

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
    printFeed(posts)
}

selectBtn.addEventListener("click", async () => {
    const getLength = await Fetch.get("posts")
    const getFirstPage = await Fetch.get(`posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc&_page=1&_limit=${select.value}`) 
    printFeed(getFirstPage)
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
            printFeed(getPage)
        })
        
        page.innerHTML = i + 1
        elem.appendChild(page)
        pagesList.appendChild(elem)
    }
})

async function printFeed(arr){
    feedList.innerHTML = ""
    arr.forEach(async(item) => {
        const elem = document.createElement("li")
        elem.classList.add("list-item")
        const spanPost = document.createElement("span")
        spanPost.classList.add("span-post")
        const commonSpan = document.createElement("span")
        commonSpan.classList.add("common-span")
        const spanCheck = document.createElement("span")
        const spanBio = document.createElement("span")
        const editBtn = document.createElement("button")
        editBtn.classList.add("edit-btn")
        editBtn.innerHTML = "Edit"
        const input = document.createElement("input")
        input.type = "checkbox"
        input.id = item.id
        const label = document.createElement("label")
        label.setAttribute('for', item.id)
        const likeQua = document.createElement("p")
        elem.prepend(spanPost)
        commonSpan.appendChild(spanCheck)
        commonSpan.appendChild(spanBio)
        commonSpan.appendChild(editBtn)
        elem.appendChild(commonSpan)
        feedList.appendChild(elem)
        spanCheck.appendChild(input)
        spanCheck.appendChild(label)
        spanCheck.prepend(likeQua)
        feedList.appendChild(elem)
        input.value = item.id
        label.value = item.id
        spanBio.innerHTML = `Author: ${item.user.name} ${item.user.surname} / Date: ${item.date} ${item.hours}`
        likeQua.innerHTML = item.likeQuantity
        spanPost.innerHTML = item.post
        
        const getLike = await Fetch.get(`likes?userId=${account}&postId=${item.id}`)
        const respLike = await getLike
        if(respLike.length === 1){
            input.checked = true
            input.disabled = true
        } 

        label.addEventListener("click", async () => {
            const getLikeStatus = await Fetch.get(`likes?userId=${account}&postId=${item.id}`)
            const respLikeStatus = await getLikeStatus
            if(respLikeStatus.length === 0){
                const bodyLikes = {
                    userId: account,
                    postId: item.id,
                    qua: 1
                }
                await Fetch.post("likes", bodyLikes)
                const body = {
                    likeQuantity: item.likeQuantity + 1
                }
                await Fetch.patch(`posts/${item.id}`, body)
                const posts = await Fetch.get("posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc")
                printFeed(posts)
            }
        })

        const link = document.createElement("a")
        link.classList.add("link-to-list")
        link.innerHTML = "Увидеть всех"
        link.href = `../html/like-list.html?postId=${item.id}`

        label.addEventListener("mouseover", async () => {
            const usersLike = await Fetch.get(`likes?postId=${item.id}&_expand=user`)
            label.innerHTML = ""
            link.style.display = "block"
            for (let i = 0; i < usersLike.length; i++) {
                const names = document.createElement("p")
                names.innerHTML = usersLike[i].user.name
                label.prepend(names)
                if(i === 2){
                    label.appendChild(link)
                    break
                }
            }
            label.addEventListener("mouseout", async () => {
                setTimeout(() => {
                    link.style.display = "none"
                    label.innerHTML = ""
                }, 1000)
            })
        })

        if(account !== item.userId){
            editBtn.remove()
        }

        editBtn.addEventListener("click", () => {
            editBtn.style.display = "none"
            const input = document.createElement("input")
            input.classList.add("edit-input")
            input.value = spanPost.innerHTML
            spanPost.innerHTML = ""
            const saveBtn = document.createElement("input")
            saveBtn.type = "button"
            saveBtn.value = "Save"
            input.type = "text"
            spanPost.prepend(input)
            spanPost.appendChild(saveBtn)
            saveBtn.addEventListener("click", async () => {
                input.remove()
                saveBtn.remove()
                const body = {
                    post: input.value
                }
            await Fetch.patch(`posts/${item.id}`, body)
            spanBio.innerHTML = `Author: ${item.user.name} ${item.user.surname} / Date: ${item.date} ${item.hours} ` 
            editBtn.style.display = "block"
            const posts = await Fetch.get("posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc")
            printFeed(posts)
            })
        })
    })
} 



