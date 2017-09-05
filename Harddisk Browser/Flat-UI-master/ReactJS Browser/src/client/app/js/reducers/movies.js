import {combineReducers} from 'redux';
import {
  FETCH_MOVIE_START,
  FETCH_MOVIE_SUCCESS,
  FETCH_MOVIE_ERROR,
} from '../actions/actionTypes.js';

export const loading = (state = false, action) => {
	if(action.type === FETCH_MOVIE_START){
		return true;
	}
	if(action.type === FETCH_MOVIE_SUCCESS || action.type === FETCH_MOVIE_ERROR){
		return false;
	}
  	return state;
};

export const data = (state = [],action) => {
	if(action.type === FETCH_MOVIE_SUCCESS){
		let {response:{data}} = action.payload;
		return data;
	}
	return state;
}

export const isLocal = (state=true, action) => {
	if(action.type === FETCH_MOVIE_SUCCESS){
		let {isLocal} = action.payload;
		return isLocal;
	}
	return state;
}

export const movies = combineReducers({
  loading,
  data,
  isLocal
});

