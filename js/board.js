import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"

const h2 = document.querySelector("h2")
h2.addEventListener("click", () => {
    location.href = "../html/app.html"
})
const feedList = document.querySelector(".feed")

const account = Storage.getData() 

getFeed()

async function getFeed(){
    const res = await Fetch.get("posts?_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc")
    printFeed(res)
}

function printFeed(arr){
    feedList.innerHTML = ""
    arr.forEach(async(item) => {
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
        spanCheck.appendChild(likeQua)
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
            if(respLikeStatus.length === 0 ){
                const bodyLikes = {
                    userId: account,
                    postId: item.id,
                    qua: 1
                }
                Fetch.post("likes", bodyLikes)
                const body = {
                    likeQuantity: item.likeQuantity + 1
                }
                Fetch.patch(`posts/${item.id}`, body)
            }
        })

        if(account !== item.userId){
            editBtn.remove()
        }

        editBtn.addEventListener("click", () => {
            editBtn.remove()
            const input = document.createElement("input")
            input.value = spanPost.innerHTML
            spanPost.innerHTML = ""
            const saveBtn = document.createElement("input")
            saveBtn.type = "button"
            saveBtn.value = "Save"
            input.type = "text"
            spanPost.prepend(input)
            spanPost.appendChild(saveBtn)
            saveBtn.addEventListener("click", () => {
                input.remove()
                saveBtn.remove()
                const body = {
                    post: input.value
                }
            Fetch.patch(`posts/${item.id}`, body) 
            })
        })
    })
} 
