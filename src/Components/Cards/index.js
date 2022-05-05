import style from "./style.module.css";

export default function Card(props) {
  const { pokemon } = props;

  return (
    <div className={style.card} key={pokemon.name} title={pokemon.name}>
      <img
        loading='lazy'
        src={pokemon.sprites?.other?.["official-artwork"]?.front_default}
        alt={pokemon.name}
      />
      <div className={style.overlay}>
        <div className={style.chips}>
          {pokemon.abilities.map(({ ability }) => (
            <h6 className={style.chip} key={ability.name}>
              {ability.name}
            </h6>
          ))}
        </div>
        <h3 className={style.title}>
          {pokemon.name}, {pokemon.weight}kg
        </h3>
        <p className={style.height}>{pokemon.height} mtrs.</p>
        <button type='button' className={style.cta}>
          Know More
        </button>
      </div>
    </div>
  );
}
