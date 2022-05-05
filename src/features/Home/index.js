import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPokemon, getPokemonDetails } from "../../utils/API";
import { Card, Filters, Loader, NoMatch } from "../../Components";
import style from "./home.module.css";
const URL = "https://pokeapi.co/api/v2/pokemon";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParams = {
    limit: searchParams.get("limit") || 20,
    offset: searchParams.get("offset") || 0,
  };
  const [pageDetails, setPageDetails] = useState(pageParams);
  const [pokemonList, setPokemonList] = useState({});
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getData = async (url) => {
    setLoading(true);
    fetchPokemon(url)
      .then((data) => {
        setPokemonList(data);
        const { results } = data;
        getPokemonDetails(results).then((details) => {
          setPokemonDetails(details);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const url = `${URL}?offset=${pageDetails.offset}&limit=${pageDetails.limit}`;
    !pokemonList.result && getData(url);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateParams = (prev) => {
    const { limit = 20, offset = 0 } = pageDetails;
    const value = { limit, offset: prev ? offset - limit : offset + limit };
    setSearchParams(value);
    setPageDetails(value);
  };

  const handlePageChange = (e) => {
    const { value } = e.target;
    setPageDetails({ limit: Number(value) });
    setSearchParams({ limit: Number(value) });
    const url = `${URL}?offset=${0}&limit=${Number(value)}`;
    getData(url);
  };

  const handleForwardNavigation = () => {
    const { next } = pokemonList;
    if (next) {
      const url = next;
      updateParams();
      getData(url);
    }
  };

  const handleBackNavigation = () => {
    const { previous } = pokemonList;
    if (previous) {
      const url = previous;
      updateParams(true);
      getData(url);
    }
  };
  console.log(pageDetails, pokemonDetails, "hi");

  return (
    <div className={style.homePage}>
      {/*     SearchComponent */}

      {/* FiltersPaginationComponent */}
      {/* https://codepen.io/codersdesign/pen/zYOgajg */}
      <Filters
        pokemonList={pokemonList}
        handleBackNavigation={handleBackNavigation}
        handleForwardNavigation={handleForwardNavigation}
        handlePageChange={handlePageChange}
        pageDetails={pageDetails}
      />

      {/* PokemonListComponent */}
      <section className={style.pokemonList}>
        {pokemonDetails?.length > 0 ? (
          pokemonDetails.map((pokemon) => (
            <Card key={pokemon.name} pokemon={pokemon} />
          ))
        ) : (
          <NoMatch />
        )}
      </section>
      <Filters
        pokemonList={pokemonList}
        handleBackNavigation={handleBackNavigation}
        handleForwardNavigation={handleForwardNavigation}
        handlePageChange={handlePageChange}
        pageDetails={pageDetails}
        noSearch
      />
      {/* LoaderComponent */}
      <Loader isLoading={isLoading} />
    </div>
  );
}
