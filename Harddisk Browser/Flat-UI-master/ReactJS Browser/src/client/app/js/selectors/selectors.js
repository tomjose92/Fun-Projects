import { createSelector } from 'reselect';

export const isFetchingMovies = (state) => state.movies && state.movies.loading;
export const getMovieData = (state) => state.movies && state.movies.data;
export const getMovieStatus = (state) => state.movies && state.movies.isLocal;

export const isFetchingTVShow = (state) => state.tvshows && state.tvshows.loading;
export const getTVShowData = (state) => state.tvshows && state.tvshows.tvShows;
export const getTVShowStatus = (state) => state.tvshows && state.tvshows.isLocal;
export const getTVShowsInfo = (state) => state.tvshows && state.tvshows.showsInfo;
export const getTVShowEpisodes = (state) => state.tvshows && state.tvshows.episodes;
export const getTVShowCasts = (state) => state.tvshows && state.tvshows.casts;
export const getCurrentTVShow = (state) => state.tvshows && state.tvshows.currentTVShow;

export const getCurrentTVShowInfo = createSelector(
  [getCurrentTVShow, getTVShowsInfo],
  (tvShowName, tvShowsInfo) => tvShowsInfo[tvShowName]
);

export const getCurrentTVShowEpisodes = createSelector(
  [getCurrentTVShow, getTVShowEpisodes],
  (tvShowName, episodes) => episodes[tvShowName]
);

export const getCurrentTVShowCasts = createSelector(
  [getCurrentTVShow, getTVShowCasts],
  (tvShowName, casts) => casts[tvShowName]
);