import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AxiosInstance, AxiosError } from 'axios';
import { CITIES, AuthorizationStatus } from '../const';
import type { City, Offer, SortType, AuthStatus, UserData, FullOffer, ReviewData } from '../types';

export type AppState = {
  city: City;
  offers: Offer[];
  sortType: SortType;
  isOffersLoading: boolean;
  isOfferNotFound: boolean;
  currentOfferId: string | null;
  offersError: string | null;
  authorizationStatus: AuthStatus;
  user: UserData | null;
  authError: string | null;
  offerDetails: FullOffer | null;
  nearbyOffers: Offer[];
  reviews: ReviewData[];
  isOfferLoading: boolean;
  isReviewsLoading: boolean;
};

type ExtraArgument = {
  api: AxiosInstance;
};

type AuthData = {
  email: string;
  password: string;
};

export const login = createAsyncThunk<
  UserData,
  AuthData,
  { extra: ExtraArgument; rejectValue: string }
>(
  'user/login',
  async ({ email, password }, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.post<UserData & { token: string }>('/login', { email, password });
      localStorage.setItem('six-cities-token', data.token);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
        details?: { property: string; messages: string[] }[];
      }>;

      const detailMessage = axiosError.response?.data?.details?.[0]?.messages?.[0];

      return rejectWithValue(detailMessage || axiosError.response?.data?.message || 'Неверный логин или пароль');
    }
  }
);

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

export const fetchOfferDetails = createAsyncThunk<
  FullOffer,
  string,
  { extra: ExtraArgument; rejectValue: string }
>(
  'offer/fetchDetails',
  async (id, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.get<FullOffer>(`/offers/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return rejectWithValue('NOT_FOUND');
      }
      return rejectWithValue('ERROR');
    }
  }
);

export const fetchNearbyOffers = createAsyncThunk<
  Offer[],
  string,
  { extra: ExtraArgument }
>(
  'offer/fetchNearby',
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Offer[]>(`/offers/${id}/nearby`);
    return data;
  }
);

export const fetchReviews = createAsyncThunk<
  ReviewData[],
  string,
  { extra: ExtraArgument }
>(
  'reviews/fetch',
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ReviewData[]>(`/comments/${id}`);
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
);

export const postReview = createAsyncThunk<
  ReviewData,
  { offerId: string; comment: string; rating: number },
  { extra: ExtraArgument; rejectValue: string }
>(
  'reviews/post',
  async ({ offerId, comment, rating }, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.post<ReviewData>(`/comments/${offerId}`, { comment, rating });
      return data;
    } catch {
      return rejectWithValue('Не удалось отправить отзыв');
    }
  }
);

export const checkAuth = createAsyncThunk<
  UserData,
  undefined,
  { extra: ExtraArgument }
>(
  'user/checkAuth',
  async (_, { extra }) => {
    try {
      const { api } = extra;
      const { data } = await api.get<UserData>('/login');
      return data;
    } catch {
      throw new Error('Not authorized');
    }
  }
);

const defaultCity = CITIES.find((city) => city.name === 'Paris') || CITIES[0];

const initialState: AppState = {
  city: defaultCity,
  offers: [],
  sortType: 'popular',
  isOffersLoading: false,
  isOfferNotFound: false,
  currentOfferId: null,
  offersError: null,
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  authError: null,
  offerDetails: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  isReviewsLoading: false,
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
    requireAuthorization(state, action: PayloadAction<AuthStatus>) {
      state.authorizationStatus = action.payload;
    },
    logout(state) {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    },
    resetOfferState(state) {
      state.isOfferNotFound = false;
      state.offerDetails = null;
      state.isOfferLoading = true;
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
      })
      .addCase(login.pending, (state) => {
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(login.rejected, (state, action) => {
        state.authError = action.payload || 'Ошибка авторизации';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isOfferLoading = true;
        state.isOfferNotFound = false;
        state.offerDetails = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.isOfferLoading = false;
        state.offerDetails = action.payload;
        state.currentOfferId = action.meta.arg;
      })
      .addCase(fetchOfferDetails.rejected, (state, action) => {
        state.isOfferLoading = false;
        state.currentOfferId = action.meta.arg;
        if (action.payload === 'NOT_FOUND') {
          state.isOfferNotFound = true;
        }
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.isReviewsLoading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isReviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.isReviewsLoading = false;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      });
  },
});

export default appSlice.reducer;

export const { changeCity, fillOffers, changeSortType, requireAuthorization, logout, resetOfferState } = appSlice.actions;
