import React, { useEffect, useReducer } from "react";
import TinderCard from "react-tinder-card";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchCocktail } from "../domain/cocktails.service";
import {
  default as CocktailReducer,
  initialState,
} from "../domain/cocktails.reducer";

const Home = () => {
  const [state, dispatch] = useReducer(CocktailReducer, initialState);
  const [cocktails, setCocktails] = useLocalStorage("cocktails", []);

  const likeCocktail = () => {
    setCocktails([...cocktails, state.cocktail]);
  };

  const retry = () => {
    fetchCocktail(dispatch, cocktails);
  };

  const renderCocktail = (cocktail) => {
    return (
      <TinderCard onCardLeftScreen={(dir) => swipeCocktail(dir)}>
        <div className="cocktail">
          <h2>{cocktail.strDrink}</h2>
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
        </div>
      </TinderCard>
    );
  };

  const swipeCocktail = (direction) => {
    if (direction === "left") {
      retry();
    } else {
      likeCocktail();
    }
  };

  useEffect(() => {
    fetchCocktail(dispatch, cocktails);
  }, [cocktails]);

  return (
    <main>
      <h1>Cocktail Tinder</h1>
      <button onClick={likeCocktail}>J'aime</button>
      <button onClick={retry}>Je n'aime pas</button>
      {state.pending && <p>Chargement...</p>}
      {state.error && <p>Une erreur est survenue.</p>}
      {!state.pending &&
        !state.error &&
        state.cocktail &&
        renderCocktail(state.cocktail)}
    </main>
  );
};

export default Home;
