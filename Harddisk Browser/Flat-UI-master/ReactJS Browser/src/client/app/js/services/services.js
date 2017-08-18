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