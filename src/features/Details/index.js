import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchPokemon } from "../../utils/API";
import { Loader, NoMatch } from "../../Components";
import style from "./details.module.css";

const URL = "https://pokeapi.co/api/v2/pokemon";
export default function Details() {
  const [searchParams] = useSearchParams();
  const pageParams = {
    id: searchParams.get("id") || 1,
  };

  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const getData = async (url) => {
    setLoading(true);
    fetchPokemon(url)
      .then((data) => {
        setPokemonDetails(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const url = `${URL}/${pageParams.id}`;
    !pokemonDetails && getData(url);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  console.log(pokemonDetails, "pokemonDetails");

  return (
    <div className={style.details}>
      {!isLoading && pokemonDetails ? (
        <div className={style.detailsCard}>
          <div className={style.detailsImageContainer}>
            <img
              className={style.detailsImage}
              src={
                pokemonDetails.sprites?.other?.["official-artwork"]
                  ?.front_default
              }
              alt={pokemonDetails.name}
            />
          </div>
          <div className={style.detailsInfo}>
            <h1 className={style.detailsName}>{pokemonDetails.name}</h1>
            <p>Height :{pokemonDetails.height}</p>
            <p>Weight :{pokemonDetails.weight}</p>
            <p>Type :{pokemonDetails.types.map((type) => type.type.name)}</p>
            <p>
              Abilities :
              {pokemonDetails.abilities.map((ability) => ability.ability.name)}
            </p>
            <p>Stats :{pokemonDetails.stats.map((stat) => stat.stat.name)}</p>
            <p>
              Egg Groups :{pokemonDetails.egg_groups?.map((egg) => egg.name)}
            </p>
            <p>Evolution :{pokemonDetails.evolution_chain?.url}</p>
          </div>
        </div>
      ) : (
        <NoMatch />
      )}

      {/* LoaderComponent */}
      <Loader isLoading={isLoading} />
    </div>
  );
}
