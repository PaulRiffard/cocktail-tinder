import React, { useEffect, useReducer } from "react";
import TinderCard from "react-tinder-card";
import { useCocktailsStorage } from "../hooks/useCocktailsStorage";
import { fetchCocktail } from "../domain/cocktails.service";
import {
  default as CocktailReducer,
  initialState,
} from "../domain/cocktails.reducer";

const Home = () => {
  const [state, dispatch] = useReducer(CocktailReducer, initialState);
  const [cocktails, likeCocktail] = useCocktailsStorage([]);

  const onLike = () => {
    likeCocktail(state.cocktail);
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
      onLike();
    }
  };

  useEffect(() => {
    fetchCocktail(dispatch, state.cocktails);
  }, [cocktails]);

  return (
    <main>
      <h1>Cocktail Tinder</h1>
      {state.pending && <p>Chargement...</p>}
      {state.error && <p>Une erreur est survenue.</p>}
      {!state.pending &&
        !state.error &&
        state.cocktail &&
        renderCocktail(state.cocktail)}
      <button onClick={retry}>Je n'aime pas</button>
      <button onClick={onLike}>J'aime</button>

    </main>
  );
};

export default Home;
