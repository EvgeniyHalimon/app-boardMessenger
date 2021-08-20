import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"

const textarea = document.querySelector("textarea")
const postBtn = document.querySelector("#submit-btn")
const postList = document.querySelector(".posts")
const board = document.querySelector("h2")
board.addEventListener("click", () => {
    location.href = "../html/main-board.html"
})

const account = Storage.getData() 

printPost()

postBtn.addEventListener("click", async () => {
    const body = {
        post: textarea.value,
        userId: account,
        likeQuantity: 0,
        date: new Date().toLocaleDateString(),
        hours: new Date().toLocaleTimeString().slice(0,-3)
    }
    await Fetch.post("posts", body)
    printPost()
})

async function printPost() {
    const posts = await Fetch.get(`posts?userId=${account}&_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc`)
    postList.innerHTML = ""
    posts.forEach(async(item) => {
        const elem = document.createElement("li")
        elem.classList.add("list-item")
        const spanPost = document.createElement("span")
        spanPost.classList.add("span-post")
        const commonSpan = document.createElement("span")
        commonSpan.classList.add("common-span")
        const spanCheck = document.createElement("span")
        spanCheck.classList.add("span-check")
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
        postList.appendChild(elem)
        spanCheck.appendChild(input)
        spanCheck.appendChild(label)
        spanCheck.appendChild(likeQua)
        input.value = item.id
        label.value = item.id
        likeQua.innerHTML = item.likeQuantity
        spanPost.innerHTML = item.post
        spanBio.innerHTML = `Author: ${item.user.name} ${item.user.surname} / Date: ${item.date} ${item.hours}`

        const getLike = await Fetch.get(`likes?userId=${account}&postId=${item.id}`)
        const respLike = await getLike
        if(respLike.length === 1){
            input.checked = true
            input.disabled = true
        }

        label.addEventListener("click", async () => {
            const getLikeStatus = await Fetch.get(`likes?userId=${account}&postId=${item.id}`)
            const respLikeStatus = await getLikeStatus
            console.log(respLikeStatus.length)
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
                const currentLike = await Fetch.get(`posts/${item.id}`)
                likeQua.innerHTML = currentLike.likeQuantity
            }
        })

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
            const currentValue = await Fetch.get(`posts/${item.id}`)
            spanPost.innerHTML = currentValue.post
            editBtn.style.display = "block"
            })
        })
    })
    
}

const logout = document.querySelector(".logout")
logout.addEventListener("submit", (e) => {
    e.preventDefault()
    Storage.removeData("account")
    document.location.href="../html/login.html"
})


