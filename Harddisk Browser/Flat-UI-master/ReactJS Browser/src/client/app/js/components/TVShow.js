import React from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'
import Header from './common/Header';
import Link from './common/Link';
import {TVSHOW_ONLINE_URL, TVSHOW_LOCAL_URL} from '../constants/apis';
import Gap from './common/Gap';
import {fetchData} from '../services/services';
import {Images, ImagePosition} from '../constants/images';
import TVShowModal from './TVShowModal';
import {blurImage} from '../utils/utils';
import {fetchTVShowData} from '../actions/actions'
import {getTVShowData, isFetchingTVShow, getTVShowStatus} from '../selectors/selectors';
import isEmpty from 'lodash/isEmpty';

class TVShow extends React.Component {
  constructor(){
      super();
      document.body.className="mediaBG";
      this.state = {
        records:[],
        error:false,
        displayTVShow:"none",
        interval:2000,
        search: false
      };
    }

    displayTVShow(){
      let {isLoading} = this.props;
      let value = (!isLoading)?"block":"none";
      return value;
    }

    fetchTVShowData(isLocal){
      console.log('fetchTVShowData');
      console.log('Accessing',isLocal?'local':'online');   
      let url = isLocal?TVSHOW_LOCAL_URL: TVSHOW_ONLINE_URL;
      this.props.fetchTVShowData({url, isLocal}); 
    }

    componentWillMount() {
      let {tvShows} = this.props;
      isEmpty(tvShows) && this.fetchTVShowData(TVSHOW_LOCAL_URL);
      let {records} = this.state;
      if(isEmpty(records))
      {
        this.setState({records: tvShows});
      }
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

    showModal(tvShow,index){
      let {records: tvShows} = this.state;
      tvShow.prev = tvShows[index-1];
      tvShow.next = tvShows[index+1];
      tvShow.index = index;
      this.setState({
        tvShow,
        open: true
      });
      blurImage(false);
    }

    setSearchText(e){
      let searchText = e.target.value.trim();
      let {tvShows} = this.props;
      
      if(searchText.length==0)
      {
        this.setState({
          records: tvShows
        });
        return;
      }
      tvShows = tvShows.filter((tvShow)=>{
        return (tvShow.tv_show_name.toLowerCase().indexOf(searchText.toLowerCase())>-1);
      });
      this.setState({
        records: tvShows
      });
    }

    toggleSearch(){
      let {search} = this.state;
      let {tvShows} = this.props;
      if(search)
      {
        this.setState({
          records: tvShows
        });
      }

      this.setState({
        search: !search
      });

    }

  	render() {
      let self=this,
    	{error, open, tvShow,search, records: tvShows} = this.state;
      let {isLocal, isLoading} = this.props;

    	let TVShowImages = isEmpty(tvShows)? null : tvShows.map(function(tvShow,i){
        let {tv_show_name, tv_show_tag} = tvShow;
        return (
          <span className='tvShow' title={tv_show_name} style={styles.imageBox} key={"tvShow"+i}>
            <a onClick={()=>self.showModal(tvShow, i)}>
              <img className='tvshow' key={"image"+i} style={Object.assign({},styles.image,Images[tv_show_tag], ImagePosition[tv_show_tag])}/>
            </a>
          </span>
        )
      });

	    return (
        <div>
          <nav>
            <Header isLocal={isLocal} loading={isLoading} error={error} onRefresh={()=>this.fetchTVShowData(TVSHOW_ONLINE_URL)} app="TVShows"/>
          </nav>
          {!isLoading && 
          <div style={styles.outerContainer}>
            <div style={styles.searchContainer}>
              <span style={{paddingRight:'10px'}}>Search</span> 
              {search && <input onChange={(e)=>this.setSearchText(e)} style={styles.inputText} type='text'></input>}
              <span style={{cursor:'pointer',paddingLeft:'10px'}} className={search?'fui-cross':'fui-search'} onClick={()=>this.toggleSearch()}/>
            </div>
            <div style={styles.container}>
              {open && <TVShowModal tvShow={tvShow} navShow={(tvShow,index)=>this.showModal(tvShow,index)} callback={()=>this.closeModal()} />}
              {TVShowImages}
            </div>
          </div>}
        </div>
      );
  	}

    componentDidMount() {
      let self=this;
      /*setTimeout(function(){
        self.fetchTVShowData(false);
      },this.state.interval);*/
    }

    componentDidUpdate(prevProps, prevState)
    {
      let {tvShows} = this.props;
      let {tvShows: oldTVShows, isLoading:oldLoading} = prevProps;
      if(tvShows!=oldTVShows && isEmpty(this.state.records))
      {
        this.setState({records: tvShows});
      }      
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
  inputText:{
    height:'25px',
    color:'black'
  },
  outerContainer:{
    textAlign: 'center',
    width:'100%'
  },
  searchContainer:{
    position:'fixed',
    top:'10px',
    width:'100%',
    zIndex:100,
    color:'white',
    height: '0px'
  },
  container:{
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
    animationName: rotateImage,
    backgroundRepeat: 'no-repeat',
    backgroundClip : 'content-box',
    backgroundSize : '1275px 1420px'
  },
  imageBox: {
    paddingLeft: '20px'
  }
}

const mapStateToProps = (state) =>{
  let tvShows = getTVShowData(state);
  let isLoading = isFetchingTVShow(state);
  let isLocal = getTVShowStatus(state);
  return {
    tvShows,
    isLoading,
    isLocal
  };
};

export default Radium(connect(
  mapStateToProps,
  {
    fetchTVShowData
  }
)(TVShow));