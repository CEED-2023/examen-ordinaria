import { randBetween, randomPokemonIds, getPokemonData } from "./pokemon.js"

let selected
let score = 0

function hideImage() {
  document.getElementById("image").classList.add('black')
}

function revealImage() {
  document.getElementById("image").classList.remove('black')
}

function addLoading() {
  const loading = document.createElement("div")
  loading.classList.add("loading")
  loading.innerHTML = `
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  `
  document.body.appendChild(loading)
}

function removeLoading() {
  const loading = document.querySelector(".loading")
  loading.remove()
}

function fourRandomPokemon() {
  const pokemonIds = randomPokemonIds(4)
  const pokemons = []

  return new Promise((resolve, reject) => {
      let index = 0

      function fetchNextPokemon() {
          if (index >= pokemonIds.length) {
              resolve(pokemons) // Resolve the promise with the collected pokemon data
              return
          }

          const id = pokemonIds[index]
          getPokemonData(id)
              .then(pokemon => {
                  pokemons.push(pokemon)
                  index++
                  fetchNextPokemon() // Fetch next pokemon data
              })
              .catch(error => {
                  reject(error) // Reject the promise if an error occurs
              })
      }

      fetchNextPokemon() // Start fetching pokemon data
  })
}

// This will be the correct implementation, but you're not requiered to do it in the exam
// function setPokemonImage(src){
//   return new Promise(resolve => {
//     const image = document.getElementById("image")
//     image.onload = resolve
//     image.src = src
//   })
// }

function setPokemonImage(src){
  const image = document.getElementById("image")
  image.src = src
}

function setButtonCaptions(names){
  for(let i=0; i<4; i++) {
    const button = document.getElementById(`answer-${i+1}`)
    button.textContent = names[i]
  }
}

function unmarkButtons() {
  for(let i=0; i<4; i++) {
    const button = document.getElementById(`answer-${i+1}`)
    button.classList.remove('correct')
    button.classList.remove('wrong')
  }
}

async function newQuestion() {
  unmarkButtons()
  addLoading()
  hideImage()
  const pokemons = await fourRandomPokemon()
  const selected = pokemons[randBetween(0, 3)]
  await setPokemonImage(selected.sprite)
  setButtonCaptions(pokemons.map(pokemon => pokemon.nombre))
  removeLoading()
  return selected
}

function wait(seconds) {
  return new Promise(resolve => {
      setTimeout(resolve, seconds * 1000)
  })
}

function increaseScore() {
  const scoreElement = document.getElementById("score")
  scoreElement.textContent = `Score: ${++score}`
}

function getButtonByName(name){
  for(let i=0; i<4; i++) {
    const button = document.getElementById(`answer-${i+1}`)
    if(button.textContent === name) return button
  }
  return null
}

function markWrongAnswer(name) {
  const button = getButtonByName(name)
  button.classList.add('wrong')
}

function markCorrectAnswer(name) {
  const button = getButtonByName(name)
  button.classList.add('correct')
}

async function reveal(name) {
  const correct = selected.nombre === name
  revealImage()
  if(correct){
    increaseScore()
  } else {
    markWrongAnswer(name)
  }
  markCorrectAnswer(selected.nombre)
  await wait(3)
  selected = await newQuestion()
}

function installHandlers(){
  for(let i=0; i<4; i++) {
    const button = document.getElementById(`answer-${i+1}`)
    button.addEventListener("click", () => reveal(button.textContent))
  }
}

installHandlers()
selected = await newQuestion()
