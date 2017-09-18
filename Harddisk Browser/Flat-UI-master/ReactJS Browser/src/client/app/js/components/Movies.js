import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header'
import Link from './common/Link'
import Space from './common/Space'
import Icon from './common/Icon'
import {MOVIE_ONLINE_URL,MOVIE_LOCAL_URL} from '../constants/apis'
import {fetchMovieData} from '../actions/actions'
import {getMovieData, isFetchingMovies, getMovieStatus} from '../selectors/selectors';
import isEmpty from 'lodash/isEmpty';

class Movies extends React.Component {
    constructor() {
      super();
      document.body.className="movieBG";
      this.state= {
        records:[],
        error:false,
        interval:2000,
        isInit: false
      };
    }

    displayMovies(){
      let {isLoading} = this.props,
      value = (!isLoading)?"block":"none";
      return value;
    }
    
    fetchMovieData(isLocal){
      console.log('Accessing',isLocal?'local':'online');   
      let url = isLocal? MOVIE_LOCAL_URL : MOVIE_ONLINE_URL; 
      let isInit = this.state.isInit;
      this.props.fetchMovieData({url, isLocal, isInit});
      !isInit && this.setState({
        isInit: true
      });
    } 

    componentWillMount() {
      let {movies} = this.props;
      if(isEmpty(movies))
        this.fetchMovieData(true);
      else
        this.setState({
          isInit: true
        });
    }

    shouldComponentUpdate(nextProps){
      return nextProps;
    }

  	render() {
      let self=this,
    	{error} = this.state,
      {movies, isLoading, isLocal} = this.props;

    	let MovieLinks = isEmpty(movies)? null : movies.map(function(movie,i){
        let movieName = movie.movie_name;
        let letterLink = "";
        if(movie.letter!="")
        {
          letterLink= (
            <span><a name={movie.letter}></a><div style={styles.letter}>Starts with {movie.letter}</div></span>
          );
        }

      	return (
        
        <div key={"movie"+i} >
          {letterLink}
          <div style={styles.container} className="fui-folder">
            <Link style={{marginLeft: '20px'}} content={movieName}/>
            <Space space='space20'/><a href=""><Icon src="img/icons/svg/video-player.svg"/></a>|
            <Space space='space20'/><a href=""><Icon src="img/icons/svg/closed-captioning.svg"/></a>
          </div>  
        </div>
      	);
    	});
	    return (
        <div><nav><Header app="Movies" isLocal={isLocal} loading={isLoading} error={error} onRefresh={()=>this.fetchMovieData(false)} />
          <div style={{display:this.displayMovies()}}>
            {MovieLinks}
          </div>  
        </nav></div>
      );
  	}

    componentDidMount() {
      let self=this,
      {interval} = this.state;
      let {movies} = this.props;
      if(isEmpty(movies))
      {
        setTimeout(function(){
          self.fetchMovieData(false);
        },interval);
      }
    }
};

const styles={
  container:{
    paddingTop: '20px',
    marginLeft: '50px',
    whiteSpace: 'nowrap'
  },
  letter:{
    marginLeft: '50px',
    paddingTop: '100px',
    fontSize: '25px',
    fontFamily: 'Cursive'
  }
}

const mapStateToProps = (state) =>{
  let movies = getMovieData(state);
  let isLoading = isFetchingMovies(state);
  let isLocal = getMovieStatus(state);
  return {
    movies,
    isLoading,
    isLocal
  };
};

export default connect(
  mapStateToProps,
  {
    fetchMovieData
  }
)(Movies);