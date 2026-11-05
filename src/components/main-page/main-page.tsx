import { useState } from 'react';
import { Link } from 'react-router-dom';
import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import CitiesList from '../cities-list/cities-list';
import SortingOptions from '../sorting-options/sorting-options';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeCity } from '../../store/reducer';
import { AppRoute, CITIES } from '../../const';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const { city, offers, sortType } = useAppSelector((state) => state);
  const filteredOffers = offers.filter((offer) => offer.city.name === city.name);
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortType) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return 0;
    }
  });

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to={AppRoute.Main}>
                <img className="header__logo" src="/img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList
              cities={CITIES}
              currentCity={city}
              onCityClick={(newCity) => dispatch(changeCity(newCity))}
            />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{sortedOffers.length} places to stay in {city.name}</b>
              <SortingOptions />
              <OffersList
                offers={sortedOffers}
                activeOfferId={activeOfferId}
                onCardHover={setActiveOfferId}
              />
            </section>
            <div className="cities__right-section">
              <Map
                offers={sortedOffers}
                city={city}
                selectedOfferId={activeOfferId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
