export enum AppRoute {
  Main = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/:id',
}

export const getOfferUrl = (id: string): string => `/offer/${id}`;
