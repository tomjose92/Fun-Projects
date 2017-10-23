import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';
import Link from './common/Link';
import {TVSHOW_ONLINE_URL, TVSHOW_LOCAL_URL} from '../constants/apis';
import Gap from './common/Gap';
import {Images, ImagePosition} from '../constants/images';
import TVShowModal from './TVShowModal';
import {blurImage} from '../utils/utils';
import {fetchTVShowsData, fetchTVShowInfo, setCurrentTVShow} from '../actions/tvshow';
import {  getTVShowData, 
          isFetchingTVShow, 
          getTVShowStatus,
          getTVShowsInfo} from '../selectors/selectors';
import isEmpty from 'lodash/isEmpty';

class TVShow extends React.Component {
  constructor(){
      super();
      document.body.className="mediaBG";
      this.state = {
        records:[],
        error:false,
        interval:2000,
        search: false,
        isInit: true
      };
    }

    fetchTVShowData(isLocal=true){
      console.log('fetchTVShowData');
      console.log('Accessing',isLocal?'local':'online');   
      let url = isLocal?TVSHOW_LOCAL_URL: TVSHOW_ONLINE_URL;
      let {isInit} = this.state;
      this.props.fetchTVShowsData({url, isLocal, isInit});
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
            <Header isLocal={isLocal} loading={isLoading} error={error} onRefresh={()=>this.fetchTVShowData(false)} app="TVShows"/>
          </nav>
          {!isLoading && 
          <div style={styles.outerContainer}>
            <div style={styles.searchContainer}>
              <span style={{paddingRight:'10px'}}>Search</span> 
              {search && <input onChange={(e)=>this.setSearchText(e)} style={styles.inputText} type='text'></input>}
              <span style={{cursor:'pointer',paddingLeft:'10px'}} className={search?'fui-cross':'fui-search'} onClick={()=>this.toggleSearch()}/>
            </div>
            <div className='tvShowPage' style={styles.container}>
              {open && <TVShowModal tvShow={tvShow} navShow={(tvShow,index)=>this.showModal(tvShow,index)} callback={()=>this.closeModal()} />}
              {TVShowImages}
            </div>
          </div>}
        </div>
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
      let {tvShows: oldTVShows, isLoading:oldLoading} = prevProps;
      if(tvShows!=oldTVShows)
      {
        this.setState({records: tvShows});
      }      
    }

};

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
    marginRight: '100px'
  },
  image:{
    height: '300px',
    width: '250px',
    cursor: 'pointer',
    paddingBottom: '20px',
    ':hover':{
      transform: 'translateY(-10px)'      
    },
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
    setCurrentTVShow
  }
)(TVShow);