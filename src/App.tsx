import { useEffect, useState } from "react";
import { CatCard } from "./components/catCard";
import { useCats } from "./hooks/useCats";
import styles from "./App.module.css";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import cn from "classnames";

export default function Home() {
  const {
    cats,
    favorites,
    isLoadingMore,
    isError,
    toggleFavorite,
    isReachingEnd,
    loadMoreCats,
  } = useCats();
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: null,
    rootMargin: "0%",
  });

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      !isLoadingMore &&
      !isReachingEnd &&
      activeTab === "all"
    ) {
      console.log("loadd");

      loadMoreCats();
    }
  }, [
    entry?.isIntersecting,
    isLoadingMore,
    isReachingEnd,
    activeTab,
    loadMoreCats,
  ]);

  const displayedCats =
    activeTab === "all" ? cats : cats.filter((cat) => favorites.has(cat.id));

  if (isError) {
    return <div className={styles.error}>Что-то пошло не так</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div className={styles.tabs}>
          <button
            className={cn(styles.trigger, {
              [styles.active]: activeTab === "all",
            })}
            onClick={() => setActiveTab("all")}
          >
            Все котики
          </button>
          <button
            className={cn(styles.trigger, {
              [styles.active]: activeTab === "favorites",
            })}
            onClick={() => setActiveTab("favorites")}
          >
            Любимые котики
          </button>
        </div>
      </div>
      <div className={styles.wrapper}>
        {activeTab === "all" && (
          <>
            <div className={styles.grid}>
              {displayedCats.map((cat) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  isFavorite={favorites.has(cat.id)}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>
            <div ref={ref} className={styles.loader}>
              <p className={styles.message}>
                {isLoadingMore
                  ? "... загружаем еще котиков ..."
                  : isReachingEnd
                  ? "котики закончились (("
                  : "загрузить еще"}
              </p>
            </div>
          </>
        )}

        {activeTab === "favorites" && (
          <>
            <div className={styles.grid}>
              {displayedCats.map((cat) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  isFavorite={true}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>
            {displayedCats.length === 0 && (
              <p className={styles.message}>пока нет любимых котов</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
