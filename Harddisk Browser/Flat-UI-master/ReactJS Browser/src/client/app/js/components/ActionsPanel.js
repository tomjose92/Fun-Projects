import React from 'react';
import {connect} from 'react-redux';
import {  addTVShow,
          searchTVShow} from '../actions/tvshow';
import {  getTVShowData, 
          getCurrentTVShow,
          getSearchOptions} from '../selectors/selectors';

class ActionsPanel extends React.Component {
  constructor(){
    super();
    document.body.className="mediaBG";
    this.state = {
      search: false,
      addShow: false
    };
  }

  setSearchText(e){
      let searchText = e.target.value.trim();
      let {tvShows} = this.props;
      
      if(searchText.length==0)
      {
        this.props.callback(tvShows);
        return;
      }

      tvShows = tvShows.filter((tvShow)=>{
        return (tvShow.tv_show_name.toLowerCase().indexOf(searchText.toLowerCase())>-1);
      });
      this.props.callback(tvShows);
    }

    toggleSearch(bool){
      let {search} = this.state;
      let {tvShows} = this.props;
      let value = bool!=undefined? bool : !search;
      if(value)
      {
        this.toggleAddShow(false);
      }

      if(search)
      {
        this.props.callback(tvShows);
      }

      this.setState({
        search: value
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
      if(value)
      {
        this.toggleSearch(false);
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

  render(){
    let {addShowText, addShow, search, options: searchOptions} = this.state;
    let options = [];
    let self = this;
    if(addShowText){
      options = searchOptions.map(function(option, index){
        let {name, rating:{average: rating}, image, status} = option;
        return (
          <li key={index} style={styles.option}>
            {name} &nbsp; &nbsp; 
            {rating && <span style={styles.showInfo}>Rating : {rating} &nbsp;|&nbsp;</span>}
            {status && <span style={styles.showInfo}>Status : {status} </span>}
            <span title={'Add TV Show : '+name} style={{cursor:'pointer',paddingLeft:'20px'}} className={'fui-plus'} onClick={()=>self.addTVShow(name)}/>
          </li>
        );
      });
    }
    return (
      <div style={styles.actionsContainer}>
        <span style={{paddingRight:'10px'}}>Search Show</span> 
        {search && <input onChange={(e)=>this.setSearchText(e)} style={styles.inputText} type='text'></input>}
        <span style={{cursor:'pointer',paddingLeft:'10px'}} className={search?'fui-cross':'fui-search'} onClick={()=>this.toggleSearch()}/>

        <span style={{paddingLeft:'30px', paddingRight: '10px'}}>Add Show</span> 
        {addShow && <input onChange={(e)=>this.setAddShow(e)} style={styles.inputText} type='text'></input>}
        <span style={{cursor:'pointer',paddingLeft:'10px'}} className={addShow?'fui-cross':'fui-plus'} onClick={()=>this.toggleAddShow()}/>
        <div className='mediaBG' style={styles.searchBar}><ul>{options}</ul></div>
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
    position:'absolute', 
    display: '-webkit-box',
    overflow: 'overlay',
    maxHeight: '150px',
    top: '50px',
    margin: '0px 500px',
    opacity: 0.8,
    width: '50%'
  },
  option:{
    textAlign: 'left', 
    fontWeight: 'bold', 
    fontSize: '20px'
  },
  inputText:{
    height:'25px',
    color:'black'
  }
}


const mapStateToProps = (state) =>{
  let tvShows = getTVShowData(state);
  let currentShow = getCurrentTVShow(state);
  let searchOptions = getSearchOptions(state);
  return {
    tvShows,
    currentShow,
    searchOptions
  };
};

export default connect(
  mapStateToProps,
  {
    addTVShow,
    searchTVShow
  }
)(ActionsPanel);  