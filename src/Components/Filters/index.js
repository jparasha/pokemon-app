import { useId } from "react";
import style from "./style.module.css";

export default function Filters(props) {
  const generatedID = useId();

  const {
    pokemonList,
    singleResult,
    handleBackNavigation,
    handleForwardNavigation,
    handlePageChange,
    handleSearch,
    handleSorting,
    pageDetails,
    noSearch,
  } = props;
  return (
    <section className={style.filters}>
      <div className={style.filters__navigationButtons}>
        <button
          type='button'
          className={style.filters__navigationButtons__button}
          disabled={singleResult || !pokemonList.previous}
          onClick={handleBackNavigation}>
          {"< Prev"}
        </button>
        <button
          type='button'
          className={style.filters__navigationButtons__button}
          disabled={singleResult || !pokemonList.next}
          onClick={handleForwardNavigation}>
          {"Next >"}
        </button>
      </div>
      {!noSearch && (
        <div className={style.filters__searchForm}>
          <form onSubmit={handleSearch} name='searchForm'>
            <input
              type='text'
              name='search'
              placeholder='Search for pokemon'
              className={style.filters__searchForm__input}
            />
            <input
              type='submit'
              className={style.filters__searchForm__submit}
              value='Search'
            />
          </form>
        </div>
      )}
      <div className={style.filters__limitDropDown}>
        <label htmlFor={generatedID + "_1"}>show :</label>
        <select
          id={generatedID + "_1"}
          disabled={singleResult}
          className={style.filters__limitDropDown__select}
          value={pageDetails.limit}
          onChange={handlePageChange}>
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='50'>50</option>
        </select>
      </div>
      <div className={style.filters__sortByDropDown}>
        <label htmlFor={generatedID + "_2"}>sort by :</label>
        <select
          id={generatedID + "_2"}
          disabled={singleResult}
          className={style.filters__sortByDropDown__select}
          value={pageDetails.sortBy}
          onChange={handleSorting}>
          <option value='name'>Name</option>
          <option value='height'>Height</option>
          <option value='weight'>Weight</option>
        </select>
      </div>
    </section>
  );
}
