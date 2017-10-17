import { createSelector } from 'reselect';

export const isFetchingMovies = (state) => state.movies && state.movies.loading;
export const getMovieData = (state) => state.movies && state.movies.data;
export const getMovieStatus = (state) => state.movies && state.movies.isLocal;

export const isFetchingTVShow = (state) => state.tvshows && state.tvshows.loading;
export const getTVShowData = (state) => state.tvshows && state.tvshows.data;
export const getTVShowStatus = (state) => state.tvshows && state.tvshows.isLocal;
export const getTVShowsInfo = (state) => state.tvshows && state.tvshows.showsInfo;
export const getCurrentTVShow = (state) => state.tvshows && state.tvshows.currentTVShow;

export const getCurrentTVShowInfo = createSelector(
  [getCurrentTVShow,getTVShowsInfo],
  (tvShowName, tvShowsInfo) => tvShowsInfo[tvShowName]
);