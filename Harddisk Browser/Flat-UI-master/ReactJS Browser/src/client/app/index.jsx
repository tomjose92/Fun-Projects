import React from 'react';
import ReactDOM from'react-dom';
import {StyleRoot} from 'radium';
import { Router, Route, browserHistory, IndexRoute  } from 'react-router'
import MediaHTML from './js/components/Media';
import Movies from './js/components/Movies';
import TVShow from './js/components/TVShow';
ReactDOM.render((
	<StyleRoot>
		<Router>
        	<Route path="/" component={MediaHTML}/>
        	<Route path="/Movies" component={Movies}/>
        	<Route path="/TVShow" component={TVShow}/>
 	   </Router>
 	</StyleRoot>
	), document.getElementById('app'));
