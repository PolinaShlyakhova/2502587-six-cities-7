import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import { CITIES } from '../const';
import type { City, Offer, SortType } from '../types';

export type AppState = {
  city: City;
  offers: Offer[];
  sortType: SortType;
  isOffersLoading: boolean;
  offersError: string | null;
};

type ExtraArgument = {
  api: AxiosInstance;
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: ExtraArgument; rejectValue: string }
>(
  'offers/fetchOffers',
  async (_, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.get<Offer[]>('/offers');
      return data;
    } catch {
      return rejectWithValue('Не удалось загрузить предложения. Проверьте соединение.');
    }
  }
);

const defaultCity = CITIES.find((city) => city.name === 'Paris') || CITIES[0];

const initialState: AppState = {
  city: defaultCity,
  offers: [],
  sortType: 'popular',
  isOffersLoading: false,
  offersError: null,
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

  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isOffersLoading = true;
        state.offersError = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.isOffersLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isOffersLoading = false;
        state.offersError = action.payload || 'Неизвестная ошибка';
      });
  },
});

export default appSlice.reducer;

export const { changeCity, fillOffers, changeSortType } = appSlice.actions;
