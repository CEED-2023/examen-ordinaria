function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TOTAL_POKEMONS = 898;

function randomPokemonIds(cantidad) {
  const pokemonIds = [];
  while (pokemonIds.length < cantidad) {
      const id = randBetween(1, TOTAL_POKEMONS)
      if (!pokemonIds.includes(id)) {
          pokemonIds.push(id);
      }
  }
  return pokemonIds;
}

function getPokemonData(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
      .then(response => response.json())
      .then(data => {
          const nombre = data.names.find(name => name.language.name === "es").name;
          return fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
              .then(response => response.json())
              .then(spriteData => {
                  const sprite = spriteData.sprites.other["official-artwork"].front_default;
                  return { nombre: nombre, sprite: sprite };
              });
      });
}

export {
  randBetween,
  randomPokemonIds,
  getPokemonData
}

