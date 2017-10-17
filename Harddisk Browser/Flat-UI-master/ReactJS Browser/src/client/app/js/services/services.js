import {Promise} from 'bluebird';
import recursivelyLowercaseJSONKeys from 'recursive-lowercase-json';

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
        let url = 'http://api.tvmaze.com/singlesearch/shows?q=' + show;
        fetch(url) 
        .then(response => response.json())
        .then(json => {
            resolve(json);
        }).catch(function(e) {
            console.log("fetchTVShow error", e);
        });
    });
}