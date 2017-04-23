import React from 'react';
import Radium from 'radium'
import TVShowSeason from './TVShowSeason'
import Header from './common/Header';
import Link from './common/Link';
import {TVSHOW_ONLINE_URL, TVSHOW_LOCAL_URL} from '../constants/apis';
import Gap from './common/Gap';
import {fetchData} from '../services/services';
import {Images} from '../constants/images';
import TVShowModal from './TVShowModal';

class TVShow extends React.Component {
  constructor(){
      super();
      document.body.className="mediaBG";
      this.state = {
        records:[],
        loading:false,
        error:false,
        displayTVShow:"none",
        isLocal:true,
        change:true,
        interval:2000
      };
    }

    displayTVShow(){
      let loading = (this.state!==undefined)?this.state.loading:true;
      let value = (!loading)?"block":"none";
      return value;
    }

    fetchTVShowData(url){
      console.log('fetchTVShowData');
      this.setState({
        loading: true
      });
      let {interval,records} = this.state,
      self=this;

      fetchData(url) 
      .then(response =>{
        let {error,data} = response,
        loading=false;
        if(error)
        {
          self.setState({loading,error});
          return;
        } 
        setTimeout(function(){
          self.setState({records:data,loading,error});
          if( url==TVSHOW_LOCAL_URL)
          {
            console.log("Online");
            self.setState({isLocal:true});
          }
          else
          {
            console.log("Refresh");
            self.setState({isLocal:false}); 
          }
        },interval);
      })
    }

    componentWillMount() {
      console.log("componentWillMount");
      
      console.log('Accessing local');   
      this.fetchTVShowData(TVSHOW_LOCAL_URL);
    
    }

    shouldComponentUpdate( nextProps){
      return nextProps;
    }

    closeModal(){
      this.setState({
        tvShow:{},
        open: false
      });
    }

    showModal(tvShow){
      this.setState({
        tvShow,
        open: true
      });
    }

  	render() {
      let self=this,
    	{records: tvShows, isLocal, loading, error, open, tvShow} = this.state;
    	let TVShowImages = tvShows.map(function(tvShow,i){
        let {tv_show_name, tv_show_tag} = tvShow;
        return (
          <span className='tvShow' title={tv_show_name} style={styles.imageBox} key={"tvShow"+i}>
            <a onClick={()=>self.showModal(tvShow)}>
              <img className='tvshow' key={"image"+i} style={styles.image} src={Images[tv_show_tag]}/>
            </a>
          </span>
        )
      });
	    return (
        <div>
          <nav>
            <Header isLocal={isLocal} loading={loading} error={error} onRefresh={()=>this.fetchTVShowData(TVSHOW_ONLINE_URL)} app="TVShows"/>
          </nav>
          <div style={styles.container}>
            {open && <TVShowModal tvShow={tvShow} callback={()=>this.closeModal()} />}
            {!loading && TVShowImages}
          </div>
        </div>
      );
  	}

    componentDidMount() {
      let self=this;
      console.log('Accessing online');   
      setTimeout(function(){
        self.fetchTVShowData(TVSHOW_ONLINE_URL);
      },this.state.interval);
    }

};

const rotateImage = Radium.keyframes({
  '0%':  {transform: 'rotateY(-180deg)'},
  '25%':  {transform: 'rotateY(-135deg)'},
  '50%': {transform: 'rotateY(-90deg)'},
  '75%': {transform: 'rotateY(-45deg)'},
  '100%': {transform: 'rotateY(0deg)'},
});


const styles={
  container:{
    textAlign: 'center',
    position: 'absolute',
    marginTop: '100px',
    marginLeft: '100px',
    marginRight: '100px',
    '@media only screen and (max-width: 1023px)': {
      marginLeft: '50px',
      marginRight: '50px'
    }
  },
  image:{
    height: '300px',
    width: '250px',
    cursor: 'pointer',
    paddingBottom: '20px',
    ':hover':{
      transform: 'translateY(-10px)'      
    },
    animation: 'x 2s ease-in',
    animationName: rotateImage
  },
  imageBox: {
    paddingLeft: '20px'
  }
}

export default Radium(TVShow);