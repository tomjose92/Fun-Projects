import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';
import Link from './common/Link';
import {TVSHOW_ONLINE_URL, TVSHOW_LOCAL_URL} from '../constants/apis';
import Gap from './common/Gap';
import {Images, ImagePosition} from '../constants/images';
import TVShowModal from './TVShowModal';
import UpcomingEpisodes from './UpcomingEpisodes';
import {blurImage, extractTVShowsFromURL, getBookmark} from '../utils/utils';
import {  fetchTVShowsData, 
          fetchTVShowInfo, 
          setCurrentTVShow, 
          setTVShowData,
          addTVShow,
          removeTVShow,
          searchTVShow} from '../actions/tvshow';
import {  getTVShowData, 
          isFetchingTVShow, 
          getTVShowStatus,
          getTVShowsInfo,
          getTVShows,
          getCurrentTVShow,
          getSearchOptions} from '../selectors/selectors';
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

    setAddShow(e){
      let addShowText = e.target.value.trim();
      this.props.searchTVShow(addShowText);
      this.setState({
        addShowText
      });
    }

    toggleAddShow(bool){
      let {addShow} = this.state;
      let value = bool!=undefined? bool : !addShow;
      this.setState({
        addShow: value,
        addShowText: ''
      });
    }

    addTVShow(){
      let {addShowText} = this.state,
      {tvShows} = this.props;
      let existingShow = tvShows.find(function(tvShow){
        return addShowText==tvShow.tv_show_name
      });
      if(addShowText && addShowText.trim()!='' && !existingShow)
      {
        this.props.addTVShow(addShowText);
      }
    }

  	render() {
      let self=this,
    	{error, open, tvShow,search, addShow, records: tvShows} = this.state;
      let {isLocal, isLoading, tvShowsInfo, searchOptions} = this.props;
      let bookmark = getBookmark(tvShows);
      let options = [];
      if(addShow){
        options = searchOptions.map(function(option, index){
          let {name, rating:{average: rating}, image, status} = option;
          return (
            <li key={index} style={styles.option}>
              {name} &nbsp; &nbsp; 
              {rating && <span style={styles.showInfo}>Rating : {rating} &nbsp;|&nbsp;</span>}
              {status && <span style={styles.showInfo}>Status : {status} </span>}
              <span title='Add' style={{cursor:'pointer',paddingLeft:'20px'}} className={'fui-plus'} onClick={()=>self.addTVShow()}/>
            </li>
          );
        });
      }

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
        <div>
          <nav>
            <Header isLocal={isLocal} loading={isLoading} error={error} onRefresh={()=>this.fetchTVShowData(false)} app="TVShows"/>
          </nav>
          {!isLoading && 
          <div style={styles.outerContainer}>
            <div style={styles.searchContainer}>
              <span style={{paddingRight:'10px'}}>Search Show</span> 
              {search && <input onChange={(e)=>this.setSearchText(e)} style={styles.inputText} type='text'></input>}
              <span style={{cursor:'pointer',paddingLeft:'10px'}} className={search?'fui-cross':'fui-search'} onClick={()=>this.toggleSearch()}/>

              <span style={{paddingLeft:'50px', paddingRight: '10px'}}>Add Show</span> 
              {addShow && <input onChange={(e)=>this.setAddShow(e)} style={styles.inputText} type='text'></input>}
              {addShow && <span style={{cursor:'pointer',paddingLeft:'10px'}} className={'fui-plus'} onClick={()=>this.addTVShow()}/>}
              <span style={{cursor:'pointer',paddingLeft:'10px'}} className={addShow?'fui-cross':'fui-plus'} onClick={()=>this.toggleAddShow()}/>
              <div className='mediaBG' style={styles.searchBar}><ul>{options}</ul></div>
            </div>
            {bookmark && <div title="Drag and Drop to Bookmark this" style={styles.bookmarkContainer}>
                <a href={bookmark} style={styles.bookmark}>Bookmark</a>
            </div>}
            <UpcomingEpisodes showModal={(tvShow)=>this.showModal(tvShow)}/>
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
      let {tvShows, currentShow} = this.props;
      let {tvShows: oldTVShows, currentShow: prevShow, isLoading:oldLoading} = prevProps;
      if(currentShow!=prevShow)
      {
        this.toggleAddShow(false);
      }
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
  bookmarkContainer:{
    zIndex: 100,
    position: 'fixed',
    top: '10px',
    textAlign: 'right',
    right: '150px',
    border: '2px solid white',
    backgroundColor: 'black'
  },
  bookmark:{
    padding: '0px 15px',
    color: 'white'
  },
  container:{
    position: 'absolute',
    marginTop: '110px',
    marginLeft: '100px',
    marginRight: '100px',
    textAlign: 'left'
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
  },
  showInfo:{
    color: 'grey',
    fontWeight: 100
  },
  searchBar:{
    position:'absolute', 
    textAlign: '-webkit-center',
    display: '-webkit-box',
    overflow: 'overlay',
    maxHeight: '150px',
    top: '50px',
    margin: '0px 500px',
    opacity: 0.8
  },
  option:{
    textAlign: 'left', 
    fontWeight: 'bold', 
    fontSize: '20px'
  }
}

const mapStateToProps = (state) =>{
  let tvShows = getTVShowData(state);
  let isLoading = isFetchingTVShow(state);
  let isLocal = getTVShowStatus(state);
  let tvShowsInfo = getTVShowsInfo(state);
  let currentShow = getCurrentTVShow(state);
  let searchOptions = getSearchOptions(state);
  return {
    tvShows,
    isLoading,
    isLocal,
    tvShowsInfo,
    currentShow,
    searchOptions
  };
};

export default connect(
  mapStateToProps,
  {
    fetchTVShowsData,
    fetchTVShowInfo,
    setCurrentTVShow,
    setTVShowData,
    addTVShow,
    removeTVShow,
    searchTVShow
  }
)(TVShow);