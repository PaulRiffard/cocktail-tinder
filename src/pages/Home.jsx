import React, { useState, useEffect } from "react";
import TinderCard from 'react-tinder-card'

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cocktail, setCocktail] = useState(null);

  const stockCocktail = (currentCocktail) => {
    if (!localStorage.getItem("cocktails")) {
      localStorage.setItem("cocktails", JSON.stringify([currentCocktail]));
      return;
    }
    const cocktails = JSON.parse(localStorage.getItem("cocktails"));
    cocktails.push(currentCocktail);
    localStorage.setItem("cocktails", JSON.stringify(cocktails));
  };

  const fetchCocktail = () => {
    setLoading(true);
    setError(false);

    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        const currentCoktail = {
          id: data.drinks[0].idDrink,
          title: data.drinks[0].strDrink,
          imgSrc: data.drinks[0].strDrinkThumb,
        };
        setCocktail(currentCoktail);
        stockCocktail(currentCoktail);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  const swipeCocktail = (direction) => {
    if (direction == "left") {
      likeCocktail(false)
    } else {
      likeCocktail(true)
    }
  }


  const likeCocktail = (like) => {
    const cocktails = JSON.parse(localStorage.getItem("cocktails"));
    cocktails[cocktails.length - 1].like = like;
    localStorage.setItem("cocktails", JSON.stringify(cocktails));
    fetchCocktail();
  };



  const renderCocktail = () => {

    return (
      <TinderCard onCardLeftScreen={(dir) => swipeCocktail(dir)}>
        <div className="cocktail">
          <h2>{cocktail.title}</h2>
          <img src={cocktail.imgSrc} alt={cocktail.title} />
        </div>
      </TinderCard>
    );
  };

  useEffect(() => {
    fetchCocktail();
  }, []);

  return (
    <main>
      <h1>Cocktail Tinder</h1>
      <button onClick={() => likeCocktail(true)}>J'aime</button>
      <button onClick={() => likeCocktail(false)}>Je n'aime pas</button>
      {loading && <p>Chargement...</p>}
      {error && <p>Une erreur est survenue.</p>}
      {!loading && !error && renderCocktail()}
    </main>
  );
};

export default Home;
