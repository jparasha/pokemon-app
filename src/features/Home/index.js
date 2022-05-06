import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchPokemon,
  getPokemonDetails,
  POKEMON_API_URL as URL,
} from "../../utils/API";
import { Card, Filters, Loader, NoMatch } from "../../Components";
import style from "./home.module.css";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParams = {
    limit: searchParams.get("limit") || 20,
    offset: searchParams.get("offset") || 0,
    sortBy: searchParams.get("sortBy") || "name",
    search: searchParams.get("search") || "",
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

  const getData = async (url, searchOnly) => {
    setLoading(true);
    if (searchOnly) {
      fetchPokemon(url)
        .then((data) => setPokemonDetails([data]))
        .catch((err) => {
          console.error(err);
          setPokemonDetails([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
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
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    let url = `${URL}?offset=${pageDetails.offset}&limit=${pageDetails.limit}`;
    if (pageDetails.search) {
      url = `${URL}/${pageDetails.search}`;
    }
    !pokemonList.result && getData(url, pageDetails.search);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateParams = (prev) => {
    const {
      limit = 20,
      offset = 0,
      sortBy = "name",
      search = "",
    } = pageDetails;
    const value = {
      offset: prev
        ? Number(offset) - Number(limit)
        : Number(offset) + Number(limit),
      limit,
      sortBy,
      search,
    };
    setSearchParams(value);
    setPageDetails(value);
  };

  const updateQueryString = (key, value) => {
    const { limit, offset, sortBy, search } = pageDetails;
    const params = { offset, limit, sortBy, search };
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

  const handleSearch = (e) => {
    e.preventDefault();
    const { limit, offset } = pageDetails;
    const { value = "" } = e.target[0];
    let url = !value
      ? `${URL}?offset=${offset}&limit=${limit}`
      : `${URL}/${value.toLowerCase()}`;
    updateQueryString("search", value.toLowerCase());
    getData(url, value);
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

  const singleResult =
    pokemonDetails?.length === 0 || pokemonDetails?.length === 1;
  return (
    <>
      <div className={style.homePage}>
        {/* FiltersPaginationComponent */}
        <Filters
          pokemonList={pokemonList}
          singleResult={singleResult}
          handleBackNavigation={handleBackNavigation}
          handleForwardNavigation={handleForwardNavigation}
          handlePageChange={handlePageChange}
          pageDetails={pageDetails}
          handleSorting={handleSorting}
          handleSearch={handleSearch}
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

        {!singleResult && (
          <Filters
            pokemonList={pokemonList}
            singleResult={singleResult}
            handleBackNavigation={handleBackNavigation}
            handleForwardNavigation={handleForwardNavigation}
            handlePageChange={handlePageChange}
            pageDetails={pageDetails}
            handleSorting={handleSorting}
            handleSearch={handleSearch}
            noSearch
          />
        )}
        {/* LoaderComponent */}
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
}
