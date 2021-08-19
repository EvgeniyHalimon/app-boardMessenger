import { Fetch } from "./fetches.js"

const h2 = document.querySelector("h2")
h2.addEventListener("click", () => {
    location.href = "../html/app.html"
})
const feedList = document.querySelector(".feed")

let account = []

getDataFromStorage()
function getDataFromStorage() {
    const getData = localStorage.getItem("account")
    const parseData = JSON.parse(getData)
    if(parseData){
        account = parseData
    }
}

/* getFeed() */

/* async function getFeed(){
    const res = await Fetch.get("posts?_sort=like_quantity,date&_order=desc,desc")
    printFeed(res)
} */

async function getName(){
    const user_id = 2
    const users = await Fetch.get("posts?_expand=user")
    console.log(users)
    /* if(users.id === user_id){
        spanBio.innerHTML = `author: ${users[0].name} ${users[0].surname} date: ${date}`
    } */
}
getName()

function printFeed(arr){
    feedList.innerHTML = ""
    arr.forEach(async(item) => {
        console.log(item)
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
        const likeQuantity = document.createElement("p")
    
        elem.prepend(spanPost)
        commonSpan.appendChild(spanCheck)
        commonSpan.appendChild(spanBio)
        commonSpan.appendChild(editBtn)
        elem.appendChild(commonSpan)
        feedList.appendChild(elem)
        spanCheck.appendChild(input)
        spanCheck.appendChild(label)
        spanCheck.appendChild(likeQuantity)
        feedList.appendChild(elem)
        
        input.value = item.id
        label.value = item.id

        
            const getLikes = await Fetch.get(`likes?user_id=${account[0].id}&post_id=${id}`)
            const responseLikes = await getLikes
            if(responseLikes.length === 1){
                input.checked = true
                input.disabled = true
            } 
        

        label.addEventListener("click", () => {
            const test = await Fetch.get(`likes?user_id=${account[0].id}&post_id=${id}`)
            const resp = await test
            if(resp.length === 0){
                const bodyLikes = {
                    user_id: account[0].id,
                    post_id: id,
                    qua: 1
                }
                Fetch.post("likes", bodyLikes)
                const body = {
                    like_quantity: like_quantity + 1
                }
                Fetch.patch(`posts/${id}`, body)
            }
        })

        likeQuantity.innerHTML = `${like_quantity}`
        spanPost.innerHTML = `${post}`
        spanPost.style.marginRight = "5px"
        

        

        if(account[0].id !== arr[i].user_id){
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
            Fetch.patch(`posts/${id}`, body) 
            })
        }) 
    })
}
