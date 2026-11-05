import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { offers } from '../mocks/offers';
import { CITIES } from '../const';
import type { City, Offer, SortType } from '../types';

export type AppState = {
  city: City;
  offers: Offer[];
  sortType: SortType;
};

const defaultCity = CITIES.find((city) => city.name === 'Paris') || CITIES[0];

const initialState: AppState = {
  city: defaultCity,
  offers: offers,
  sortType: 'popular',
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
    changeSortType(state, action: PayloadAction<SortType>) {
      state.sortType = action.payload;
    },
  },
});

export default appSlice.reducer;

export const { changeCity, fillOffers, changeSortType } = appSlice.actions;
