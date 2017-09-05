import * as ActionTypes from './actionTypes.js';
import * as Services from '../services/services.js';

export const fetchMovieStart = () => {
  return {
    type: ActionTypes.FETCH_MOVIE_START
  };
};

export const fetchMovieSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_MOVIE_SUCCESS,
    payload: data
  };
};

export const fetchMovieError = (data) => {
  return {
    type: ActionTypes.FETCH_MOVIE_ERROR,
    payload: data
  };
};

export const fetchTVShowStart = () => {
  return {
    type: ActionTypes.FETCH_TVSHOW_START
  };
};

export const fetchTVShowSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_SUCCESS,
    payload: data
  };
};

export const fetchTVShowError = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_ERROR,
    payload: data
  };
};

export const fetchMovieData = (data) => {
  return (dispatch) => {
    dispatch(fetchMovieStart());
    let {url, isLocal} = data;
    Services.fetchData(url)
    .then((response)=>{
      setTimeout(() => {
        dispatch(fetchMovieSuccess({response, isLocal}));
      }, 2000);
    }).catch( (err) => {
      dispatch(fetchMovieError(err));
    });
  };
};

export const fetchTVShowData = (data) => {
  return (dispatch) => {
    dispatch(fetchTVShowStart());
    let {url, isLocal} = data;
    Services.fetchData(url)
    .then((response)=>{
      setTimeout(() => {
        dispatch(fetchTVShowSuccess({response, isLocal}));
      }, 2000);
    }).catch( (err) => {
      dispatch(fetchTVShowError(err));
    });
  };
};
