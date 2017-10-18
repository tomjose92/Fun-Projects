import {Promise} from 'bluebird';
import recursivelyLowercaseJSONKeys from 'recursive-lowercase-json';
import {TVMAZE_SHOW_URL, TVMAZE_EPISODES_URL} from '../constants/apis';

export const fetchData= (url) =>{
    console.log("fetching url " + url);
    return new Promise( (resolve) => {
    	let error=false,data;
	    fetch(url) 
    	.then(response => response.json())
    	.then(json => {
       		data=json.records || json;
            data =recursivelyLowercaseJSONKeys(data);
       		resolve ({data,error});
    	}).catch(function(e) {
        	console.log("fetchurl error");
        	error=true;
        	resolve ({data,error});
    	});
    });
}

export const fetchTVShowInfo= (show) =>{
    console.log("fetching TVShowInfo " + show);
    return new Promise( (resolve) => {
        let url = TVMAZE_SHOW_URL + show;
        fetch(url) 
        .then(response => response.json())
        .then(json => {
            resolve(json);
        }).catch(function(e) {
            console.log("fetchTVShowInfo error", e);
        });
    });
}

export const fetchTVShowEpisodes = (id) =>{
    console.log("fetching TVShowEpisodes " + id);
    return new Promise( (resolve) => {
        let url = TVMAZE_EPISODES_URL.replace('id', id);
        fetch(url) 
        .then(response => response.json())
        .then(json => {
            resolve(json);
        }).catch(function(e) {
            console.log("fetchTVShowEpisodes error", e);
        });
    });
}