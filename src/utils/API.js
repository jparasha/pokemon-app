import { Services } from "./Services";

export const fetchPokemon = (url) => {
  return Services.get(url);
};

export const getPokemonDetails = (urls = []) =>
  Promise.all(urls.map((poke) => Services.get(poke.url)));
