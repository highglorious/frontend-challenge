/// <reference types="vite-plugin-svgr/client" />
import styles from "./FavoriteButton.module.css";
import cn from "classnames";
import Heart from "../../assets/heart.svg?react";
import FilledHeart from "../../assets/filledHeart.svg?react";
import RedHeart from "../../assets/redHeart.svg?react";
import { ButtonHTMLAttributes } from "react";
import { useHover } from "@uidotdev/usehooks";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isHovered: boolean;
  isFavorite: boolean;
}

export const FavoriteButton: React.FC<ButtonProps> = ({
  onClick,
  isHovered,
  isFavorite,
}) => {
  const [ref, hovering] = useHover();
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(styles.button, { [styles.visible]: isHovered })}
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
    >
      {hovering ? <FilledHeart /> : isFavorite ? <RedHeart /> : <Heart />}
    </button>
  );
};
