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
console.log(account)

getPost()

postBtn.addEventListener("click", () => {
    const body = {
        post: textarea.value,
        userId: account,
        likeQuantity: 0,
        date: new Date().toLocaleDateString(),
        hours: new Date().toLocaleTimeString().slice(0,-3)
    }
    Fetch.post("posts", body)
})

async function getPost() {
    let res= await Fetch.get(`posts?userId=${account}&_expand=user&_sort=likeQuantity,date,hours&_order=desc,desc,desc`)
    printPost(res)
    console.log(res)
}

function printPost(arr) {
    postList.innerHTML = ""
    arr.forEach(async(item) =>{
        const elem = document.createElement("li")
        elem.classList.add("list-item")
        const spanPost = document.createElement("span")
        const commonSpan = document.createElement("span")
        commonSpan.style.display = "flex"
        const spanCheck = document.createElement("span")
        spanCheck.style.display = "flex"
        spanCheck.style.marginRight = "5px"
        const spanBio = document.createElement("span")
        const editBtn = document.createElement("button")
        editBtn.innerHTML = "Edit"
        editBtn.style.marginLeft = "5px"
        const input = document.createElement("input")
        
        input.type = "checkbox"
        input.id = item.id
        const label = document.createElement("label")
        label.style.paddingRight = "5px"
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

        likeQua.innerHTML = item.likeQuantity
        spanPost.innerHTML = item.post
        spanPost.style.marginRight = "5px"
        spanBio.innerHTML = `Author: ${item.user.name} ${item.user.surname} / Date: ${item.date} ${item.hours}`
        editBtn.addEventListener("click", () => {
            editBtn.remove()
            const input = document.createElement("input")
            input.style.width = "250px"
            input.value = spanPost.innerHTML
            spanPost.innerHTML = ""
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

const logout = document.querySelector(".logout")
logout.addEventListener("submit", (e) => {
    e.preventDefault()
    Storage.removeData("account")
    document.location.href="../html/login.html"
})


