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

export const fetchMovieError = () => {
  return {
    type: ActionTypes.FETCH_MOVIE_ERROR
  };
};

export const fetchTVShowsStart = () => {
  return {
    type: ActionTypes.FETCH_TVSHOWS_START
  };
};

export const fetchTVShowsSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOWS_SUCCESS,
    payload: data
  };
};

export const fetchTVShowsError = () => {
  return {
    type: ActionTypes.FETCH_TVSHOWS_ERROR
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

export const fetchTVShowsData = (data) => {
  return (dispatch) => {
    dispatch(fetchTVShowsStart());
    let {url, isLocal, isInit} = data;
    let interval = isInit? 0: 1000;
    Services.fetchData(url)
    .then((response)=>{
      let {error} = response;
      if(!error){
        setTimeout(() => {
          dispatch(fetchTVShowsSuccess({response, isLocal, isInit}));
        }, interval);
      }
      else
        dispatch(fetchTVShowsError());
    });
  };
};

export const fetchTVShowInfoSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_INFO_SUCCESS,
    payload: data
  };
};

export const setCurrentTVShowSuccess = (tvShowName) => {
  return {
    type: ActionTypes.SET_CURRENT_TVSHOW_SUCCESS,
    payload: {tvShowName}
  };
};

export const fetchTVShowEpisodesSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_EPISODES_SUCCESS,
    payload: data
  };
};

export const fetchTVShowInfo = (tvShowName) => {
  return (dispatch) => {
    Services.fetchTVShowInfo(tvShowName)
    .then((response)=>{
      let {id} = response;
      dispatch(fetchTVShowEpisodes({tvShowID:id ,tvShowName}));
      dispatch(fetchTVShowInfoSuccess({tvShowName,response}));
    });
  };
};

export const fetchTVShowEpisodes = (data) => {
  return (dispatch) => {
    let {tvShowID, tvShowName} = data;
    Services.fetchTVShowEpisodes(tvShowID)
    .then((response)=>{
      dispatch(fetchTVShowEpisodesSuccess({tvShowName,response}));
    });
  };
}

export const setCurrentTVShow = (tvShowName) =>{
  return (dispatch) =>{
    dispatch(setCurrentTVShowSuccess(tvShowName));
  }
}