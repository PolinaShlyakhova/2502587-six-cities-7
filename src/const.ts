import type { Rating, City, SortType } from './types';

export const ICON_SIZE: [number, number] = [27, 39];
export const ICON_ANCHOR: [number, number] = [13.5, 39];

export const CITIES: City[] = [
  { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 } },
  { name: 'Cologne', location: { latitude: 50.9375, longitude: 6.9603, zoom: 10 } },
  { name: 'Brussels', location: { latitude: 50.8503, longitude: 4.3517, zoom: 10 } },
  { name: 'Amsterdam', location: { latitude: 52.3909553943508, longitude: 4.85309666406198, zoom: 10 } },
  { name: 'Hamburg', location: { latitude: 53.5511, longitude: 9.9937, zoom: 10 } },
  { name: 'Dusseldorf', location: { latitude: 51.2277, longitude: 6.7735, zoom: 10 } },
];

export const RATING_OPTIONS: { value: Rating; title: string }[] = [
  { value: 5, title: 'perfect' },
  { value: 4, title: 'good' },
  { value: 3, title: 'not bad' },
  { value: 2, title: 'badly' },
  { value: 1, title: 'terribly' },
];

export enum AppRoute {
  Main = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/:id',
}

export const getOfferUrl = (id: string): string => `/offer/${id}`;

export const SORT_TYPES: Record<SortType, string> = {
  'popular': 'Popular',
  'price-low': 'Price: low to high',
  'price-high': 'Price: high to low',
  'rating': 'Top rated first',
};
