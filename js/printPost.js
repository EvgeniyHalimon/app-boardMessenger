import { Fetch } from "./fetches.js"



export default async function printFeed(arr,list,account,func){
    list.innerHTML = ""
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
        spanCheck.appendChild(input)
        spanCheck.appendChild(label)
        spanCheck.prepend(likeQua)
        list.appendChild(elem)
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
                func()
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
            editBtn.style.display = "block"
            func()
            })
        })
    })
} 