import React from 'react';
import ReactDOM from'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import MediaHTML from './js/components/Media';
import Movies from './js/components/Movies';
import TVShow from './js/components/TVShow';
import {Provider} from 'react-redux';
import configureStore from './js/store/store';
var  harddiskBrowserStore = configureStore();

ReactDOM.render((
	<Provider store = {harddiskBrowserStore}>
		<Router history={hashHistory}>
        	<Route path="/" component={MediaHTML}/>
        	<Route path="/Movies" component={Movies}/>
        	<Route path="/TVShow" component={TVShow}/>
 	   </Router>
 	</Provider>
	), document.getElementById('app')
);
