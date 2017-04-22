import React from 'react'
import Header from './common/Header'
import Link from './common/Link'
import Space from './common/Space'
import Icon from './common/Icon'
import {MOVIE_ONLINE_URL,MOVIE_LOCAL_URL} from '../constants/apis'
import {fetchData} from '../services/services'

class Movies extends React.Component {
    constructor() {
      super();
      document.body.className="movieBG";
      this.state= {
        records:[],
        loading:true,
        error:false,
        displayMovies:"none",
        isLocal:true,
        interval:2000
      };
    }

    displayMovies(){
      let loading = (this.state!=null)?this.state.loading:true,
      value = (!loading)?"block":"none";
      return value;
    }


    fetchMovieData(url){
      console.log('fetchMovieData');
      this.setState({loading:true});
      let {interval} = this.state,
      self=this;
      fetchData(url) 
      .then(response => {
        let {data,error} = response,
        loading=false;
        if(error)
        {
          self.setState({loading,error});
          return;
        } 
        setTimeout(function(){
          if(url==MOVIE_LOCAL_URL)
          {
            console.log("Online");
            self.setState({isLocal:true});
          }
          else
          {
            console.log("Refresh");
            self.setState({isLocal:false}); 
          }
          self.setState({records:data,loading,error});
        },interval);
      })
    } 

    componentWillMount() {
      console.log("componentWillMount");
      console.log('Accessing local');   
      this.fetchMovieData(MOVIE_LOCAL_URL);
    }

    shouldComponentUpdate(nextProps){
      return nextProps;
    }

  	render() {
      let self=this,
    	{records:movies, isLocal, loading, error} = this.state,
    	MovieLinks = movies.map(function(movie,i){
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
        <div><nav><Header app="Movies" isLocal={isLocal} loading={loading} error={error} onRefresh={()=>this.fetchMovieData(MOVIE_ONLINE_URL)} />
          <div style={{display:this.displayMovies()}}>
            {MovieLinks}
          </div>  
        </nav></div>
      );
  	}

    componentDidUpdate(){

    }

    componentDidMount() {
      let self=this,
      {interval} = this.state;
      console.log('Accessing online');   
      setTimeout(function(){
        self.fetchMovieData(MOVIE_ONLINE_URL);
      },interval);
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

export default Movies;