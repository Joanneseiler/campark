const signUpButton = document.getElementById('signUp')
const signInButton = document.getElementById('signIn')
const container = document.getElementById('container')
signUpButton.addEventListener('click', () => { container.classList.add("right-panel-active")})
signInButton.addEventListener('click', () => { container.classList.remove("right-panel-active")})

const signUpNav = document.getElementById('navSignUp')
//const signInNav = document.getElementById('navSignIn')
signUpNav.addEventListener('click', () => { 
    console.log(container.classList.add("right-panel-active") )
    container.classList.add("right-panel-active") 
})
// signInNav.addEventListener('click', () => { 
//     console.log(container.classList.add("right-panel-active") )
//     container.classList.remove("right-panel-active") 
// })
