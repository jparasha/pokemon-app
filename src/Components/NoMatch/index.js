import style from "./style.module.css";

export default function NoMatch({ isLoading }) {
  return (
    <div className={style.noMatch}>
      <h1>{isLoading ? "Loading, Please wait" : "No Match Found"}</h1>
      {!isLoading && (
        <button
          className={style.noMatchButton}
          onClick={() => {
            window.location.href = "/";
          }}>
          Go Home
        </button>
      )}
    </div>
  );
}
