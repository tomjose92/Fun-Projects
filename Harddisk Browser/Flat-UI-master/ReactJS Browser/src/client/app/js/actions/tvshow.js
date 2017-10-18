import * as ActionTypes from './actionTypes.js';
import * as Services from '../services/services.js';

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

export const fetchTVShowInfoSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_INFO_SUCCESS,
    payload: data
  };
};

export const fetchTVShowEpisodesSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_EPISODES_SUCCESS,
    payload: data
  };
};

export const fetchTVShowCastSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_TVSHOW_CAST_SUCCESS,
    payload: data
  };
};

export const setCurrentTVShowSuccess = (tvShowName) => {
  return {
    type: ActionTypes.SET_CURRENT_TVSHOW_SUCCESS,
    payload: {tvShowName}
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

export const fetchTVShowInfo = (tvShowName) => {
  return (dispatch) => {
    Services.fetchTVShowInfo(tvShowName)
    .then((response)=>{
      let {id} = response;
      dispatch(fetchTVShowEpisodes({tvShowID:id , tvShowName}));
      dispatch(fetchTVShowCast({tvShowID:id, tvShowName}));
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

export const fetchTVShowCast = (data) => {
  return (dispatch) => {
    let {tvShowID, tvShowName} = data;
    Services.fetchTVShowCast(tvShowID)
    .then((response)=>{
      dispatch(fetchTVShowCastSuccess({tvShowName,response}));
    });
  };
}

export const setCurrentTVShow = (tvShowName) =>{
  return (dispatch) =>{
    dispatch(setCurrentTVShowSuccess(tvShowName));
  }
}