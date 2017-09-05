import {combineReducers} from 'redux';
import {movies} from './movies';
import {tvshows} from './tvshow';
export const createReducer = () => {
  return combineReducers({
    movies,
    tvshows
  });
};

export default createReducer;
