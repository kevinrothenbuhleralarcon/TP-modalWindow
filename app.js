"use strict"

let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []
let previouslyFocusedElement = null

const openModal = async function(e) {
    e.preventDefault()
    const target = e.target.getAttribute("href")
    if (target.startsWith("#")) {
        modal = document.querySelector(target)
    } else {
        modal = await loadModal(target)
    }
    focusables = [...modal.querySelectorAll(focusableSelector)]
    previouslyFocusedElement = document.querySelector(":focus")
    modal.style.display = null
    focusables[0].focus()
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function(e) {
    if (modal === null) return
    e.preventDefault()
    modal.setAttribute("aria-hidden", true)
    modal.setAttribute("aria-modal", false)
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    modal.addEventListener("animationend", () => {
        modal.style.display = "none"
        modal = null  
    }, {once: true})
}

const stopPropagation = function(e) {
    e.stopPropagation()
}

const focusInModal = function(e) {
    e.preventDefault()
    if (!focusables?.length) return // Check that there's focusable element in the modal otherwise we'll have an error
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

const loadModal = async function(url) {
    const target = `#${url.split("#")[1]}`
    const existingModal = document.querySelector(target)
    if (existingModal !== null) return existingModal
    const html = await fetch(url).then(response => response.text())
    const element = document.createRange().createContextualFragment(html).querySelector(target)
    if (element === null) throw `Element ${target} was not found on the page ${url}`
    document.body.append(element)
    return element
}

document.querySelectorAll(".js-modal").forEach(link => {
    link.addEventListener("click", openModal)
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if(e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})