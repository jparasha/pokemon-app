import style from "./style.module.css";

export default function Loader({ isLoading }) {
  return (
    isLoading && (
      <div className={style.loader}>
        <div className={style.loader__inner}></div>
      </div>
    )
  );
}
