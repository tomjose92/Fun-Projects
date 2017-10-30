import * as ActionTypes from './actionTypes.js';
import * as Services from 'services';

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

export const fetchMovieError = () => {
  return {
    type: ActionTypes.FETCH_MOVIE_ERROR
  };
};

export const fetchMovieData = (data) => {
  return (dispatch) => {
    dispatch(fetchMovieStart());
    let {url, isLocal, isInit} = data;
    let interval = isInit? 0: 1000;
    Services.fetchData(url)
    .then((response)=>{
      let {error} = response;
      if(!error){
        setTimeout(() => {
          dispatch(fetchMovieSuccess({response, isLocal, isInit}));
        }, interval);
      }
      else
        dispatch(fetchMovieError());  
    });
  };
};


