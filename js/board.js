import { Fetch } from "./fetches.js"
import { GetData } from "./getDataFromStorage.js"

const h2 = document.querySelector("h2")
h2.addEventListener("click", () => {
    location.href = "../html/app.html"
})
const feedList = document.querySelector(".feed")

const account = GetData.getDataFromStorage() 

getFeed()

async function getFeed(){
    const res = await Fetch.get("posts?_expand=user&_sort=like_quantity,date&_order=asc,asc")
    printFeed(res)
}

function printFeed(arr){
    feedList.innerHTML = ""
    arr.forEach(async(item) => {
        const elem = document.createElement("li")
        elem.classList.add("list-item")
        const spanPost = document.createElement("span")
        const commonSpan = document.createElement("span")
        const spanCheck = document.createElement("span")
        const spanBio = document.createElement("span")
        const editBtn = document.createElement("button")
        editBtn.innerHTML = "Edit"
        editBtn.style.marginLeft = "5px"
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
        spanBio.innerHTML = `author: ${item.user.name} ${item.user.surname} date: ${item.date}`
        
        const getLike = await Fetch.get(`likes?userId=${account[0].id}&postId=${item.id}`)
        const respLike = await getLike
        
        if(respLike.length === 1){
            input.checked = true
            input.disabled = true
        } 

        label.addEventListener("click", async () => {
            const getLikeStatus = await Fetch.get(`likes?userId=${account[0].id}&postId=${item.id}`)
            const respLikeStatus = await getLikeStatus
            if(respLikeStatus.length === 0 ){
                const bodyLikes = {
                    userId: account[0].id,
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

        likeQua.innerHTML = item.likeQuantity
        spanPost.innerHTML = item.post
        spanPost.style.marginRight = "5px"

        if(account[0].id !== arr.userId){
            editBtn.remove()
        }

        editBtn.addEventListener("click", () => {
            editBtn.remove()
            spanPost.innerHTML = ""
            const input = document.createElement("input")
            const saveBtn = document.createElement("input")
            saveBtn.type = "button"
            saveBtn.value = "Save"
            input.type = "text"
            input.style.marginRight = "5px"
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
