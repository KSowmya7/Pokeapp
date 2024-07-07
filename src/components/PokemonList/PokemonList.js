import './PokemonList.css'
import { useEffect} from 'react';
import { useState} from 'react';
import axios from "axios";
import Pokemon from '../Pokemon/Pokemon'

function PokemonList(){
  const DEFAULT_URL = "https://pokeapi.co/api/v2/pokemon/"
  const [pokemonList, setpokemonList] =useState([])
  const [pokedexUrl, setpokedexUrl] = useState(DEFAULT_URL);
  const [nextUrl, setNextUrl] = useState(DEFAULT_URL);
  const [prevUrl, setPrevUrl] = useState(DEFAULT_URL);


    async function downloadPokemons(){
        const response = await axios.get(pokedexUrl ? pokedexUrl : DEFAULT_URL); 

        const pokemonresults = response.data.results;  //array of pokemons

        setNextUrl(response.data.next);
        setPrevUrl(response.data.Previous);

        const pokemonPromise =pokemonresults.map((pokemon) => axios.get(pokemon.url)); //axios  returns array  of  promise

        const pokemonListData = await axios.all(pokemonPromise);

        const pokemonFinalList = pokemonListData.map(pokemonData => {
          const pokemon = pokemonData.data;
          return {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other.dream_world.front_default,
            types: pokemon.types
          }
        } );
        setpokemonList(pokemonFinalList);
        
    }
   
    useEffect(() => {
      downloadPokemons();

    }, [pokedexUrl])

    return(
      <div className='pokemon-list-wrapper'>
        <div> 
          <h1>Pokemon List</h1>
        </div>
        <div className='page-controls'>
          <button onClick={() => setpokedexUrl(prevUrl)}>Prev</button>
          <button onClick={() => setpokedexUrl(nextUrl)}>Next</button>
        </div>
        <div class='pokemon-list'> 
          {pokemonList.map(pokemon => <Pokemon name={pokemon.name} key = {pokemon.id} url = {pokemon.image} id={pokemon.id}/>)}
        </div>
      </div>
    );

}

export default PokemonList
