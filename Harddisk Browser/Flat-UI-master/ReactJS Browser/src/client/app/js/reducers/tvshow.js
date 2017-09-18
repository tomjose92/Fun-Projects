import {combineReducers} from 'redux';
import {
  FETCH_TVSHOW_START,
  FETCH_TVSHOW_SUCCESS,
  FETCH_TVSHOW_ERROR
} from '../actions/actionTypes.js';

export const loading = (state = false, action) => {
	if(action.type === FETCH_TVSHOW_START){
		return true;
	}
	if(action.type === FETCH_TVSHOW_SUCCESS){
		let {isInit} = action.payload;
		return !isInit;
	}else if(action.type === FETCH_TVSHOW_ERROR){
		return false;
	}
  	return state;
};

export const data = (state = [],action) => {
	if(action.type === FETCH_TVSHOW_SUCCESS){
		let {response:{data}} = action.payload;
		return data;
	}
	return state;
}

export const isLocal = (state=true, action) => {
	if(action.type === FETCH_TVSHOW_SUCCESS){
		let {isLocal} = action.payload;
		return isLocal;
	}
	return state;
}

export const tvshows = combineReducers({
  loading,
  data,
  isLocal
});

