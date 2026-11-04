import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { offers } from '../mocks/offers';
import { CITIES } from '../const';
import type { City, Offer } from '../types';

export type AppState = {
  city: City;
  offers: Offer[];
};

const defaultCity = CITIES.find((city) => city.name === 'Paris') || CITIES[0];

const initialState: AppState = {
  city: defaultCity,
  offers: offers,
};

const appSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity(state, action: PayloadAction<City>) {
      state.city = action.payload;
    },
    fillOffers(state, action: PayloadAction<Offer[]>) {
      state.offers = action.payload;
    },
  },
});

export default appSlice.reducer;

export const { changeCity, fillOffers } = appSlice.actions;
