import {Promise} from 'bluebird';

export const fetchData= (url) =>{
    console.log("fetching url " + url);
    return new Promise( (resolve) => {
    	let error=false,data;
	    fetch(url) 
    	.then(response => response.json())
    	.then(json => {
       		data=json.records;
       		resolve ({data,error});
    	}).catch(function(e) {
        	console.log("fetchurl error");
        	error=true;
        	resolve ({data,error});
    	});
    });
}