camelize = function camelize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


async function getPokemones(n) {
    try {
        const URL = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${n*20}`;
        const dataRaw = await fetch(URL);
        const data = await dataRaw.json();

        //Aqui tengo en data el listado de los primeros n pokemones
        //el objeto data tiene un componente llamado results
        //el cual es un arreglo de json que contienen un par
        //name con el nombre del pokemon en minusculas
        //y url con la direccion del recurso.
        //esta url usaremos para obtener datos adicionales del pokemon
        //para desplegar en nuestras tarjetas
        for (const element of data.results) {
            const pokemonDataRaw = await fetch(element.url);
            const pokemonData = await pokemonDataRaw.json();
            
            // Puedes hacer lo que necesites con cada pokemonData aquí
            element.name = camelize(element.name);
            //console.log(pokemonData.sprites.other.dream_world.front_default);
            element.imgUrl = pokemonData.sprites.other.dream_world.front_default;
            if(element.imgUrl === null){
                element.imgUrl = pokemonData.sprites.front_default;
            }
            element.weight = pokemonData.weight;
            element.abilities = pokemonData.abilities;
            element.moves = pokemonData.moves;
            element.stats = pokemonData.stats;
            element.types = pokemonData.types;
        }
        
        return data.results;
    } catch (error) {
        console.error(error);
        return null;
    } 
}

const min = 1;
const max = 20;

// Obtener un número aleatorio entre min y max
const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
/*let titulo = document.getElementById("titulo");
titulo.textContent = '';
titulo.innerHTML += `Pokemon Golden List Cards - First ${numeroAleatorio} Pokemons`;*/

const pokemonesArray = [];
getPokemones(numeroAleatorio)
.then(pokemonesArray => {

    //Vamos a modificar el DOM para pegar nuestros pokemones



    let spanPokemones = document.getElementById("pokemon-cards");
    spanPokemones.textContent = '';
    pokemonesArray.map(item => {
        //const abilitiesSubset = item.abilities.slice(0, 1); // Obtener el primer elemento del arreglo abilities

        spanPokemones.innerHTML += 

        `<article class="main-container__article">
        <div class="main-container__div main-container__div--front">
          <img
            class="main-container__img"
            src="${item.imgUrl}"
            alt="Pokemon img"
          />
          <p class="main-container__p main-container__p--pokemon">${item.name}</p>
        </div>
        <div class="main-container__div main-container__div--back">
          <p class="main-container__p main-container__p--data">
          ${item.name}</br></br>
          Type: ${item.types.slice(0, 1)[0].type.name}</br>
          Weight: ${item.weight} kg</br>
          Abilitie: ${item.abilities.slice(0, 1)[0].ability.name}</br>
          Move: ${item.moves.slice(0, 1)[0].move.name}</br>
          </p>
        </div>
      </article>`;
    })

    //console.log(pokemonesArray);
})
.catch(error => {
    console.error(error);
});
