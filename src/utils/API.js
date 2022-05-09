import { Services } from "./Services";
import { API } from "../config";

export const fetchPokemon = (url) => {
  return Services.get(url);
};

export const getPokemonDetails = (urls = []) =>
  Promise.all(urls.map((poke) => Services.get(poke.url)));

const fallBackURL = "https://pokeapi.co/api/v2/";

export const POKEMON_API_URL = (API || fallBackURL) + "pokemon";
