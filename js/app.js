import { Fetch } from "./fetches.js"
import { GetData } from "./getDataFromStorage.js"

const textarea = document.querySelector("textarea")
const postBtn = document.querySelector("#submit-btn")
const postList = document.querySelector(".posts")
const board = document.querySelector("h2")
board.addEventListener("click", () => {
    location.href = "../html/main-board.html"
})

const account = GetData.getDataFromStorage() 

getPost()

postBtn.addEventListener("click", () => {
    const body = {
        post: textarea.value,
        userId: account[0].id,
        likeQuantity: 0,
        date: new Date
    }
    Fetch.post("posts", body)
})

async function getPost() {
    let res= await Fetch.get(`posts?userId=${account[0].id}&_sort=likeQuantity,date&_order=desc,desc`)
    printPost(res)
}

function printPost(arr) {
    postList.innerHTML = ""
    arr.forEach(async(item) =>{
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
        postList.appendChild(elem)
        spanCheck.appendChild(input)
        spanCheck.appendChild(label)
        spanCheck.appendChild(likeQua)
        input.value = item.id
        label.value = item.id

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
        spanBio.innerHTML = `author: ${account[0].name} ${account[0].surname} date: ${item.date}`
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

const logout = document.querySelector(".logout")
logout.addEventListener("submit", (e) => {
    e.preventDefault()
    document.location.href="../html/login.html"
    localStorage.removeItem("account")
})


