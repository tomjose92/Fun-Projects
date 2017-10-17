import {combineReducers} from 'redux';
import {
  FETCH_TVSHOWS_START,
  FETCH_TVSHOWS_SUCCESS,
  FETCH_TVSHOWS_ERROR,
  FETCH_TVSHOW_INFO_SUCCESS,
  SET_CURRENT_TVSHOW_SUCCESS
} from '../actions/actionTypes.js';

export const loading = (state = false, action) => {
	if(action.type === FETCH_TVSHOWS_START){
		return true;
	}
	if(action.type === FETCH_TVSHOWS_SUCCESS){
		let {isInit} = action.payload;
		return !isInit;
	}else if(action.type === FETCH_TVSHOWS_ERROR){
		return false;
	}
  	return state;
};

export const data = (state = [],action) => {
	if(action.type === FETCH_TVSHOWS_SUCCESS){
		let {response:{data}} = action.payload;
		return data;
	}
	return state;
}

export const isLocal = (state=true, action) => {
	if(action.type === FETCH_TVSHOWS_SUCCESS){
		let {isLocal} = action.payload;
		return isLocal;
	}
	return state;
}

export const showsInfo = (state={}, action) => {
	if(action.type === FETCH_TVSHOW_INFO_SUCCESS){
		let {tvShowName, response} = action.payload;
		if(response){
			let newState = state;
			newState[tvShowName] = response;
			return newState;
		}
	}
	return state;	
}

export const currentTVShow = (state='', action) =>{
	if(action.type === SET_CURRENT_TVSHOW_SUCCESS || action.type === FETCH_TVSHOW_INFO_SUCCESS){
		return action.payload.tvShowName;
	}
	return state;
}

export const tvshows = combineReducers({
  loading,
  data,
  isLocal,
  showsInfo,
  currentTVShow
});

