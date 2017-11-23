import React from 'react';
import {connect} from 'react-redux';
import {  addTVShow,
          searchTVShow} from '../actions/tvshow';
import {  getTVShowData, 
          getCurrentTVShow,
          getSearchOptions,
          getTVShowsInfo,
          getTVShowGenres
        } from 'selectors';
import includes from 'lodash/includes';
import {getBookmark} from 'utils';
import {debounce} from 'throttle-debounce';

class ActionsPanel extends React.Component {
  constructor(){
    super();
    document.body.className="mediaBG";
    this.state = {
      search: false,
      addShow: false,
      showGenre: false
    };
    this.searchTVShow = debounce(200, this.searchTVShow);
  }

  getUpdatedTVShows(){
    let {tvShows} = this.props;
    let {filteredTVShows=[]} = this.state;
    return filteredTVShows.length>0? filteredTVShows : tvShows;
  }

  setSearchText(e){
    let searchText = e.target.value.trim();
    let tvShows = this.getUpdatedTVShows();
    if(searchText.length!=0)
    {
      tvShows = tvShows.filter((tvShow)=>{
        return (tvShow.tv_show_name.toLowerCase().indexOf(searchText.toLowerCase())>-1);
      });
    }
    this.props.callback(tvShows);
  }

  toggleSearch(bool){
    let {search} = this.state;
    let tvShows = this.getUpdatedTVShows();
    let value = bool!=undefined? bool : !search;
    if(value)
    {
      this.toggleAddShow(false);
      this.toggleGenre(false);
    }

    if(search)
    {
      this.props.callback(tvShows);
    }

    this.setState({
      search: value
    });
  }

  searchTVShow(query)
  {
    this.props.searchTVShow(query);
  }

  setAddShow(e){
    let addShowText = e.target.value.trim();
    addShowText && this.searchTVShow(addShowText);
    this.setState({
      addShowText
    });
  }

  toggleAddShow(bool){
    let {addShow} = this.state;
    let value = bool!=undefined? bool : !addShow;
    if(value)
    {
      this.toggleSearch(false);
      this.toggleGenre(false);
    }

    this.setState({
      addShow: value,
      addShowText: null,
      options: []
    });
  }

  addTVShow(tvShowName){
    let {tvShows} = this.props;
    let existingShow = tvShows.find(function(tvShow){
      return tvShowName==tvShow.tv_show_name
    });
    if(tvShowName && tvShowName.trim()!='' && !existingShow)
    {
      this.props.addTVShow(tvShowName);
    }
  }

  toggleGenre(bool){
    let {showGenre} = this.state;
    let tvShows = this.getUpdatedTVShows();
    let value = bool!=undefined? bool:!showGenre;

    if(value){
      this.toggleSearch(false);
      this.toggleAddShow(false);
    }
    else if(showGenre)
    {
      this.props.callback(tvShows);
    }

    this.setState({
      showGenre: value
    });
  }

  sortFilterByGenre(queryGenre){
    let {tvShowsInfo} = this.props;
    let {genreList=[]} = this.state;
    if(!queryGenre)
    {
      genreList=[];
    }
    else if(!includes(genreList, queryGenre))
    {
      genreList.push(queryGenre);
    }
    else{
      let index = genreList.findIndex(function(genre){
        return genre == queryGenre
      });
      genreList = [...genreList.slice(0, index), ...genreList.slice(index+1)];
    }

    let tvShows = [];
    if(genreList.length==0)
    {
      tvShows = this.props.tvShows;
    }
    else{
      for(let i in tvShowsInfo){
        let tvShow = tvShowsInfo[i];
        let {genres} = tvShow;
        let genreFound = genreList.find(function(genre){
          return genres.includes(genre)
        });
        if(genreFound){
          tvShows.push({tv_show_name: i});
        }
      }
    }
    this.props.callback(tvShows);
    this.setState({
      genreList,
      filteredTVShows: tvShows
    });
    
  }

  render(){
    let {addShowText, addShow, search, options: searchOptions, showGenre, genreList} = this.state;
    let {genres, tvShows} = this.props;
    let options = [], genreHTML = [];
    let bookmark = getBookmark(tvShows);
    let self = this;
    if(addShowText){
      options = searchOptions.map(function(option, index){
        let {name, rating:{average: rating}, image, status} = option;
        return (
          <li title={'Add TV Show : '+name}  className='option' key={index} style={styles.option}
            onClick={()=>self.addTVShow(name)}>
            <span style={{paddingRight:'20px'}} className={'fui-plus'}/>
            {name} &nbsp; &nbsp; 
            {rating && <span style={styles.optionInfo}>Rating : {rating} &nbsp;|&nbsp;</span>}
            {status && <span style={styles.optionInfo}>Status : {status} </span>}
          </li>
        );
      });
    }

    if(showGenre)
    {
      genreHTML = genres.map(function(genre, index){
        let isChecked = includes(genreList,genre);
        let newStyles = {...styles.genre, color: (isChecked?'lightgreen':'white')};
        return (
          <li className='option' key={index} style={newStyles} 
            onClick={()=>self.sortFilterByGenre(genre)}>
            {isChecked && <span style={{marginLeft: '-30px', position:'absolute'}} className="fui-check"></span>}
            {genre} 
          </li>
        );
      });
    }

    return (
      <div style={styles.actionsContainer}>
        {search && <span>
          <span style={{paddingRight:'10px'}}>Search Show</span>
          <input onChange={(e)=>this.setSearchText(e)} style={styles.inputText} type='text'></input>
        </span>}
        <span title={!search?'Search Show':''} style={{cursor:'pointer',paddingLeft:(search?'10px':'30px')}} className={search?'fui-cross':'fui-search'} onClick={()=>this.toggleSearch()}/>

        {addShow && <span>
          <span style={{paddingLeft:'30px', paddingRight: '10px'}}>Add Show</span>
          <input onChange={(e)=>this.setAddShow(e)} style={styles.inputText} type='text'></input>
        </span>}
        <span title={!addShow?'Add Show':''} style={{cursor:'pointer',paddingLeft:(addShow?'10px': '30px')}} className={addShow?'fui-cross':'fui-plus'} onClick={()=>this.toggleAddShow()}/>

        {showGenre && <span>
            <span title='By Genre' style={{paddingLeft:'30px'}}>Filter By Genre</span>
            <span title='Reset Filter' style={{cursor:'pointer',padding:'0px 10px'}} className='fui-cross' onClick={()=>this.sortFilterByGenre()}/> 
        </span>}
        <span title={!showGenre?'Filter By Genre':''} style={{cursor: 'pointer', paddingLeft:(showGenre?'10px': '30px')}} className="fui-list-columned" 
          onClick={()=>this.toggleGenre()}></span>

        {bookmark && <div title="Drag and Drop to Bookmark this" style={styles.bookmarkContainer}>
            <a href={bookmark} style={styles.bookmark}>Bookmark</a>
        </div>}

        {addShow && 
          <div className='mediaBG' style={styles.searchBar}>
            <ul style={styles.list}>{options}</ul>
          </div>
        }
        {showGenre && 
          <div className='mediaBG' style={styles.genreBar}>
              <ul style={styles.list}>{genreHTML}</ul>
          </div>
        }
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState)
  {
    let {currentShow, searchOptions} = this.props;
    let {currentShow: prevShow, searchOptions: oldSearchOptions} = prevProps;
    if(searchOptions.length > 0 && searchOptions!=oldSearchOptions)
    {
      this.setState({
        options: searchOptions
      });
    }
    if(currentShow!=prevShow)
    {
      this.toggleAddShow(false);
    }     
  }
}

const styles = {
  actionsContainer:{
    position:'fixed',
    top:'10px',
    width:'100%',
    zIndex:100,
    color:'white',
    height: '0px'
  },
  searchBar:{
    position:'relative', 
    display: '-webkit-box',
    overflow: 'overlay',
    maxHeight: '150px',
    margin: '0px auto',
    top: '12px',
    width: '50%',
    left: '100px'
  },
  option:{
    textAlign: 'left', 
    fontWeight: 'bold', 
    fontSize: '20px',
    marginLeft: '-20px',
    cursor:'pointer'
  },
  optionInfo:{
    color: 'grey',
    fontWeight: 100
  },
  genreBar:{
    position:'relative', 
    display: '-webkit-box',
    overflow: 'overlay',
    maxHeight: '150px',
    top: '12px',
    margin: '0px auto',
    opacity: 0.8,
    width: '250px',
    left: '130px',
    border: '1px solid grey'
  },
  genre:{
    textAlign: 'left', 
    fontWeight: 'bold', 
    fontSize: '20px',
    cursor: 'pointer',
    width: 'auto'
  },
  inputText:{
    height:'25px',
    color:'black'
  },
  list: {
    listStyleType: 'none'
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
  }
}


const mapStateToProps = (state) =>{
  let tvShows = getTVShowData(state);
  let currentShow = getCurrentTVShow(state);
  let searchOptions = getSearchOptions(state);
  let tvShowsInfo = getTVShowsInfo(state);
  let genres = getTVShowGenres(state);
  return {
    tvShows,
    tvShowsInfo,
    currentShow,
    searchOptions,
    genres
  };
};

export default connect(
  mapStateToProps,
  {
    addTVShow,
    searchTVShow
  }
)(ActionsPanel);    