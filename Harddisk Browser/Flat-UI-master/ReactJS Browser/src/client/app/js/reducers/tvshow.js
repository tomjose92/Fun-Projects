import {combineReducers} from 'redux';
import {
  FETCH_TVSHOWS_START,
  FETCH_TVSHOWS_SUCCESS,
  FETCH_TVSHOWS_ERROR,
  FETCH_TVSHOW_INFO_SUCCESS,
  FETCH_TVSHOW_EPISODES_SUCCESS,
  FETCH_TVSHOW_CAST_SUCCESS,
  SET_CURRENT_TVSHOW_SUCCESS,
  ADD_TVSHOW_SUCCESS,
  REMOVE_TVSHOW_SUCCESS
} from '../actions/actionTypes.js';

import {	findOtherCastShows, 
			getBookmark, 
			getYear, 
			getDate} from '../utils/utils';
import includes from 'lodash/includes';

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

export const tvShows = (state = [],action) => {
	if(action.type === FETCH_TVSHOWS_SUCCESS){
		let {response:{data}} = action.payload;
		return data;
	}
	if(action.type === ADD_TVSHOW_SUCCESS)
	{
		let {tvShowName} = action.payload;
		state.unshift({
			tv_show_name: tvShowName, 
			tv_show_tag: tvShowName.replace(/\s/g,'').toLowerCase()
		});
		window.location.href = getBookmark(state);
	}
	if(action.type === REMOVE_TVSHOW_SUCCESS)
	{
		let {tvShowName} = action.payload;
		state = state.filter(function(tvShow){
			return tvShowName!=tvShow.tv_show_name
		});
		window.location.href = getBookmark(state);
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

export const showsInfo = (state=[], action) => {
	if(action.type === FETCH_TVSHOW_INFO_SUCCESS){
		let {tvShowName, response} = action.payload;
		if(response){
			let newState = {...state};
			newState[tvShowName] = response;
			return newState;
		}
	}

	if(action.type === REMOVE_TVSHOW_SUCCESS)
	{
		let {tvShowName} = action.payload;
		delete state[tvShowName];
	}
	return state;	
}

export const episodes = (state=[], action) => {
	if(action.type === FETCH_TVSHOW_EPISODES_SUCCESS){
		let {tvShowName, response} = action.payload;
		let upcoming;
		if(response){
			let {_embedded:{episodes: responseEpisodes}} = response;
			let episodes = responseEpisodes.map(function(episode){
				let {id, name, season, number, summary, airstamp} = episode;
				let dateInfo = getDate(airstamp);
				if(!upcoming && (dateInfo.color == 'yellow' || dateInfo.color == 'red'))
				{
					upcoming = {...episode, ...dateInfo};
				}
				return {id, tv_show_episode:name, season, number, summary, ...dateInfo};
			});
			
			let seasons = [];
			for(let i=0;i<episodes.length;i++)
			{
				let episode = episodes[i];
				let {season:seasonNo, number, date} = episode;
				if(!seasons[seasonNo-1])
				{
					seasons[seasonNo-1] = {
						tv_show_season: seasonNo, 
						episodes:[],
						year: getYear(date)
					};
				}
				let {episodes: episodesData} = seasons[seasonNo-1];
				episodesData[number-1] = episode;
				seasons[seasonNo-1].episodes = episodesData;
			}
			let newState = {...state};
			seasons = seasons.reverse();
			newState[tvShowName] = {seasons, upcoming};
			return newState;
		}
	}
	if(action.type === REMOVE_TVSHOW_SUCCESS)
	{
		let {tvShowName} = action.payload;
		delete state[tvShowName];
	}
	return state;	
}

export const casts = (state=[],action) =>{
	if(action.type === FETCH_TVSHOW_CAST_SUCCESS){
		let {tvShowName, response} = action.payload;
		if(response){
			let {_embedded:{cast: responseCast}} = response;
			let casts = responseCast.map(function(cast){
				let {person:{name: realName, image: real},
					character:{name: characterName, image: character}} = cast;
				let realImage = real && real.medium;
				let characterImage = character && character.medium;
				return {realName, realImage, characterName, characterImage};
			});
			let newState = {...state};
			newState[tvShowName] = casts;
			state = newState;
		}
	}
	if(action.type === REMOVE_TVSHOW_SUCCESS)
	{
		let {tvShowName} = action.payload;
		delete state[tvShowName];
	}
	return findOtherCastShows(state);
}

export const genres = (state=[], action) =>{
	if(action.type === FETCH_TVSHOW_INFO_SUCCESS){
		let {response} = action.payload;
		if(response){
			let {genres} = response;
			genres = state.concat(genres);
			let newGenres = [];
			for(let i in genres) {
		        if(!includes(newGenres, genres[i])) {
		            newGenres.push(genres[i]);
		        }
		    }
			return newGenres;
		}
	}
	return state;
}

export const currentTVShow = (state='', action) =>{
	if(action.type === SET_CURRENT_TVSHOW_SUCCESS){
		return action.payload.tvShowName;
	}
	return state;
}

export const options = (state=[], action) =>{
	if(action.type === 'CLEAR_SEARCH'){
		return [];
	}
	if(action.type === 'SEARCH_TVSHOW_SUCCESS'){
		let {response} = action.payload;
		let searchOptions = response.map(function(show){
			let {show: {name, status, image, rating, id}} = show;
			return {name, status, image, rating, id}
		});
		return searchOptions;
	}
	return state;	
}

export const tvshows = combineReducers({
  loading,
  tvShows,
  isLocal,
  showsInfo,
  episodes,
  casts,
  currentTVShow,
  options,
  genres
});

