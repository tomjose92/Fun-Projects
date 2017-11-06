import React from 'react';
import Radium,{StyleRoot} from 'radium';
import {connect} from 'react-redux';
import Header from './common/Header';
import Link from './common/Link';
import {TVSHOW_ONLINE_URL, TVSHOW_LOCAL_URL} from '../constants/apis';
import Gap from './common/Gap';
import {Images, ImagePosition} from '../constants/images';
import TVShowModal from './TVShowModal';
import UpcomingEpisodes from './UpcomingEpisodes';
import {blurImage, extractTVShowsFromURL} from 'utils';
import {  fetchTVShowsData, 
          fetchTVShowInfo, 
          setCurrentTVShow, 
          setTVShowData,
          removeTVShow} from '../actions/tvshow';
import {  getTVShowData, 
          isFetchingTVShow, 
          getTVShowStatus,
          getTVShowsInfo,
          getTVShows} from 'selectors';
import isEmpty from 'lodash/isEmpty';
import ActionsPanel from './ActionsPanel';

@Radium
class TVShow extends React.Component {
  constructor(){
      super();
      document.body.className="mediaBG";
      this.state = {
        records:[],
        error:false,
        interval:2000,
        search: false,
        addShow: false,
        isInit: true
      };
    }

  fetchTVShowData(isLocal=true){
    console.log('fetchTVShowData');
    console.log('Accessing',isLocal?'local':'online');   

    let data = extractTVShowsFromURL();
    let url = isLocal?TVSHOW_LOCAL_URL: TVSHOW_ONLINE_URL;
    let {isInit} = this.state;
    if(data.length>0)
    {
      this.props.setTVShowData(data);  
    }
    else
    {
      this.props.fetchTVShowsData({url, isLocal, isInit});
    }
    !isInit && this.setState({
      isInit: true
    });
  }

  componentWillMount() {
    let {tvShows} = this.props;
    if(isEmpty(tvShows)){
      this.fetchTVShowData(false);
    }
    else
    {
      let {records} = this.state;
      if(isEmpty(records))
      {
        this.setState({
          records: tvShows, 
          isInit: true
        });
      }
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
    let {tvShowsInfo} = this.props;
    let {tv_show_name} = tvShow;
    if(!tvShowsInfo[tv_show_name])
    {
      this.props.fetchTVShowInfo(tv_show_name);
    }
    else
    {
      this.props.setCurrentTVShow(tv_show_name);  
    }
    if(index!=undefined)
    {
      tvShow.prev = tvShows[index-1];
      tvShow.next = tvShows[index+1];
      tvShow.index = index;
    }
    this.setState({
      tvShow,
      open: true
    });
    blurImage(false);
  }

  setTVShowsState(tvShows){
    this.setState({
      records: tvShows
    });
  }

	render() {
    let self=this,
  	{error, open, tvShow, records: tvShows} = this.state;
    let {isLocal, isLoading, tvShowsInfo} = this.props;

  	let TVShowImages = isEmpty(tvShows)? null : tvShows.map(function(tvShow,i){
      let {tv_show_name, tv_show_tag} = tvShow;
      let showInfo = tvShowsInfo && tvShowsInfo[tv_show_name];
      let image = showInfo && showInfo.image && showInfo.image.medium;
      return (
        <span className='tvShow' title={tv_show_name} style={styles.imageBox} key={"tvShow"+i}>
          <div style={styles.close} onClick={()=>self.props.removeTVShow(tv_show_name)}>&#10005;</div>
          <a onClick={()=>self.showModal(tvShow, i)}>
            {false ? 
              <img className='tvshow' key={"image"+i} style={Object.assign({},styles.image,Images[tv_show_tag], ImagePosition[tv_show_tag])}/>
              :<img className='tvshow' key={"image"+i} style={styles.image} src={image}/>
            }
          </a>
        </span>
      )
    });

    return (
      <StyleRoot>
        <nav>
          <Header isLocal={isLocal} loading={isLoading} error={error} onRefresh={()=>this.fetchTVShowData(false)} app="TVShows"/>
        </nav>
        {!isLoading && 
        <div style={styles.outerContainer}>
          <ActionsPanel callback={(tvShows)=>this.setTVShowsState(tvShows)} />
          <UpcomingEpisodes showModal={(tvShow)=>this.showModal(tvShow)}/>
          <div style={styles.container}>
            {open && <TVShowModal tvShow={tvShow} navShow={(tvShow,index)=>this.showModal(tvShow,index)} callback={()=>this.closeModal()} />}
            {TVShowImages}
          </div>
        </div>}
      </StyleRoot>
    );
	}

  componentDidMount() {
    /*let self=this;
    let {records} = this.state;
    if(isEmpty(records))
    {
      setTimeout(function(){
        self.fetchTVShowData(false);
      },this.state.interval);
    }*/
  }

  componentDidUpdate(prevProps, prevState)
  {
    let {tvShows} = this.props;
    let {tvShows: oldTVShows} = prevProps;
    if(tvShows!=oldTVShows)
    {
      this.setState({records: tvShows});
    }      
  }
};

const styles={
  outerContainer:{
    textAlign: 'center',
    width:'100%'
  },
  container:{
    position: 'absolute',
    top: '110px',
    left: '-20px',
    right: '0px',
    textAlign: 'center',
    '@media screen and (min-width: 1600px)':{
      left: '20px',
      right: '50px',
    },
  },
  image:{
    height: '300px',
    width: '250px',
    cursor: 'pointer',
    paddingBottom: '20px',
    backgroundRepeat: 'no-repeat',
    backgroundClip : 'content-box',
    backgroundSize : '1275px 1420px'
  },
  imageBox: {
    paddingLeft: '20px',
    position: 'relative',
    width: '270px',
    height: '300px',
    display: 'inline-block'
  },
  close:{
    background: '#56544D',
    color: '#CEC9BE',
    cursor: 'pointer',
    fontFamily: 'times new roman',
    fontSize: '20px',
    lineHeight: '30px',
    fontWeight: 'bold',
    padding: '0px',
    position: 'absolute',
    right: '0px',
    top: '0px',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    textShadow: 'none',
    zIndex: '10',
    opacity: '0.7'
  }
}
const mapStateToProps = (state) =>{
  let tvShows = getTVShowData(state);
  let isLoading = isFetchingTVShow(state);
  let isLocal = getTVShowStatus(state);
  let tvShowsInfo = getTVShowsInfo(state);
  return {
    tvShows,
    isLoading,
    isLocal,
    tvShowsInfo
  };
};

export default connect(
  mapStateToProps,
  {
    fetchTVShowsData,
    fetchTVShowInfo,
    setCurrentTVShow,
    setTVShowData,
    removeTVShow,
  }
)(TVShow);  