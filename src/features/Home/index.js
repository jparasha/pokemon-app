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
    sortBy: searchParams.get("sortBy") || "name",
  };
  const [pageDetails, setPageDetails] = useState(pageParams);
  const [pokemonList, setPokemonList] = useState({});
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const sortData = (data, sortBy) => {
    return data.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });
  };

  const getData = async (url) => {
    setLoading(true);
    fetchPokemon(url)
      .then((data) => {
        setPokemonList(data);
        const { results } = data;
        getPokemonDetails(results).then((details) => {
          const sortedDetails = sortData(details, pageParams.sortBy);
          setPokemonDetails(sortedDetails);
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
    const { limit = 20, offset = 0, sortBy = "name" } = pageDetails;
    const value = {
      limit,
      offset: prev ? offset - limit : offset + limit,
      sortBy,
    };
    setSearchParams(value);
    setPageDetails(value);
  };

  const updateQueryString = (key, value) => {
    const { limit, offset, sortBy } = pageDetails;
    const params = { limit, offset, sortBy };
    params[key] = value;
    setSearchParams(params);
    setPageDetails(params);
  };

  const handlePageChange = (e) => {
    const { value } = e.target;
    updateQueryString("limit", value);
    const url = `${URL}?offset=${0}&limit=${Number(value)}`;
    getData(url);
  };

  const handleSorting = (e) => {
    const { value } = e.target;
    updateQueryString("sortBy", value);
    const sortedDetails = sortData(pokemonDetails, value);
    setPokemonDetails(sortedDetails);
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

  return (
    <div className={style.homePage}>
      {/* FiltersPaginationComponent */}
      <Filters
        pokemonList={pokemonList}
        handleBackNavigation={handleBackNavigation}
        handleForwardNavigation={handleForwardNavigation}
        handlePageChange={handlePageChange}
        pageDetails={pageDetails}
        handleSorting={handleSorting}
      />

      {/* PokemonListComponent */}
      <section className={style.pokemonList}>
        {pokemonDetails?.length > 0 ? (
          pokemonDetails.map((pokemon) => (
            <Card key={pokemon.name} pokemon={pokemon} />
          ))
        ) : (
          <NoMatch isLoading={isLoading} />
        )}
      </section>

      <Filters
        pokemonList={pokemonList}
        handleBackNavigation={handleBackNavigation}
        handleForwardNavigation={handleForwardNavigation}
        handlePageChange={handlePageChange}
        pageDetails={pageDetails}
        handleSorting={handleSorting}
        noSearch
      />
      {/* LoaderComponent */}
      <Loader isLoading={isLoading} />
    </div>
  );
}
