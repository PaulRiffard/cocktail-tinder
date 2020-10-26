import React, { useState, useEffect, useCallback } from "react";

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

  const fetchCocktail = useCallback(() => {
    setLoading(true);
    setError(false);

    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        const cocktails = localStorage.getItem("cocktails")
          ? JSON.parse(localStorage.getItem("cocktails"))
          : [];
        if (cocktails.find((c) => c.id === data.drinks[0].idDrink)) {
          fetchCocktail();
          return;
        }
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
  }, []);

  const likeCocktail = (like) => {
    const cocktails = JSON.parse(localStorage.getItem("cocktails"));
    cocktails[cocktails.length - 1].like = like;
    localStorage.setItem("cocktails", JSON.stringify(cocktails));
    fetchCocktail();
  };

  const renderCocktail = () => {
    return (
      <div className="cocktail">
        <h2>{cocktail.title}</h2>
        <img src={cocktail.imgSrc} alt={cocktail.title} />
      </div>
    );
  };

  useEffect(() => {
    fetchCocktail();
  }, [fetchCocktail]);

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
