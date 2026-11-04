import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import type { City } from '../../types';

type CitiesListProps = {
  cities: City[];
  currentCity: City;
  onCityClick: (city: City) => void;
};

function CitiesList({ cities, currentCity, onCityClick }: CitiesListProps): JSX.Element {
  return (
    <ul className="locations__list tabs__list">
      {cities.map((city) => (
        <li className="locations__item" key={city.name}>
          <Link
            className={`locations__item-link tabs__item ${
              city.name === currentCity.name ? 'tabs__item--active' : ''
            }`}
            to={AppRoute.Main}
            onClick={() => onCityClick(city)}
          >
            <span>{city.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default CitiesList;
