"use strict"

let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []

const openModal = function(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = [...modal.querySelectorAll(focusableSelector)]
    modal.style.display = null
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    modal.addEventListener("click", closeModal, {once: true})
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal, {once: true})
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function(e) {
    if (modal === null) return
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", true)
    modal.setAttribute("aria-modal", false)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null   
}

const stopPropagation = function(e) {
    e.stopPropagation()
}

const focusInModal = function(e) {
    e.preventDefault()
    if (!focusables?.length) return // Check that there's focusable element in the modal otherwise we'll have an error
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    index++
    if (index >= focusables.length) {
        index = 0
    }
    focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach(link => {
    link.addEventListener("click", openModal)
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && e.key === "Esc") {
        closeModal(e)
    }
    if(e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})