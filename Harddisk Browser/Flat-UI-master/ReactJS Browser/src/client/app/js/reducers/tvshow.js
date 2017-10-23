import {combineReducers} from 'redux';
import {
  FETCH_TVSHOWS_START,
  FETCH_TVSHOWS_SUCCESS,
  FETCH_TVSHOWS_ERROR,
  FETCH_TVSHOW_INFO_SUCCESS,
  FETCH_TVSHOW_EPISODES_SUCCESS,
  FETCH_TVSHOW_CAST_SUCCESS,
  SET_CURRENT_TVSHOW_SUCCESS
} from '../actions/actionTypes.js';

import {getYear, getDate} from '../utils/utils';

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
	return state;	
}

export const episodes = (state=[], action) => {
	if(action.type === FETCH_TVSHOW_EPISODES_SUCCESS){
		let {tvShowName, response} = action.payload;
		if(response){
			let episodes = response.map(function(episode){
				let {id, name, season, number, summary, airdate} = episode;
				let dateInfo = getDate(airdate);
				return {id, tv_show_episode:name, season, number, summary, airdate, ...dateInfo};
			});
			
			let seasons = [];
			for(let i=0;i<episodes.length;i++)
			{
				let episode = episodes[i];
				let {season:seasonNo, number, airdate} = episode;
				
				if(!seasons[seasonNo-1])
				{
					seasons[seasonNo-1] = {
						tv_show_season: seasonNo, 
						episodes:[],
						year: getYear(airdate)
					};
				}
				let {episodes: episodesData} = seasons[seasonNo-1];
				episodesData[number-1] = episode;
				seasons[seasonNo-1].episodes = episodesData;
			}
			let newState = {...state};
			newState[tvShowName] = seasons;
			return newState;
		}
	}
	return state;	
}

export const casts = (state=[],action) =>{
	if(action.type === FETCH_TVSHOW_CAST_SUCCESS){
		let {tvShowName, response} = action.payload;
		if(response){
			let casts = response.map(function(cast){
				let {person:{name: realName, image: real},
					character:{name: characterName, image: character}} = cast;
				let realImage = real && real.medium;
				let characterImage = character && character.medium;
				return {realName, realImage, characterName, characterImage};
			});
			let newState = {...state};
			newState[tvShowName] = casts;
			return newState;
		}
	}
	return state;
}

export const currentTVShow = (state='', action) =>{
	if(action.type === SET_CURRENT_TVSHOW_SUCCESS || action.type === FETCH_TVSHOW_EPISODES_SUCCESS){
		return action.payload.tvShowName;
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
  currentTVShow
});

