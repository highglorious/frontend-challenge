import type { Cat } from "../../types/catApi";
import styles from "./CatCard.module.css";
import { FavoriteButton } from "../favoriteButton";
import { useHover } from "@uidotdev/usehooks";
interface CatCardProps {
  cat: Cat;
  isFavorite: boolean;
  onFavoriteToggle: (id: string) => void;
}

export function CatCard({ cat, isFavorite, onFavoriteToggle }: CatCardProps) {
  const [ref, hovering] = useHover();

  return (
    <div ref={ref} className={styles.card}>
      <img src={cat.url} alt="Cat" className={styles.image} />

      <FavoriteButton
        isHovered={hovering}
        isFavorite={isFavorite}
        onClick={() => onFavoriteToggle(cat.id)}
      />
    </div>
  );
}
