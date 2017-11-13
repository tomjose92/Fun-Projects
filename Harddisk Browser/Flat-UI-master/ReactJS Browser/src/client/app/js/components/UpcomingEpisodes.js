import React from 'react';
import {connect} from 'react-redux';
import Marquee from 'react-text-marquee';
import {getTVShowEpisodes, getTVShowData} from 'selectors';
import {sortEpisodesByDate, stripHTMLFromText, getUpcomingShows} from '../utils/utils';

class UpcomingEpisodes extends React.Component {
  constructor(){
    super();
    this.state={
      toggle: false
    };
  }

  showModal(tvShowName){
    let {tvShows} = this.props;
    let tvShow = tvShows.find(function(tvShow){
      return tvShow.tv_show_name == tvShowName
    });
    this.props.showModal(tvShow);
  }

  filterByUpcoming(){
    let {tvShows,upComingEpisodes} = this.props;
    let {toggle} = this.state;
    let filteredShows = tvShows;
    
    if(!toggle)
    {
      filteredShows = upComingEpisodes.map(function(episode){
        return {tv_show_name:episode.tvShowName};
      });
    }

    this.setState({
      toggle: !toggle
    });

    this.props.callback(filteredShows);
  }

  render(){
    let {upComingEpisodes} = this.props;
    let self = this;
    let html = upComingEpisodes.map(function(episode, index){
      let {tvShowName, episode:{summary, color, date, season, number, name}} = episode;
      let displayName = `${tvShowName} : S${season}E${number} ${name} (${date})`;
      return (
        <span style={{color, padding:'0px 30px', cursor: 'pointer'}} 
          key={index} title={stripHTMLFromText(summary) || ''}
          onClick={()=>self.showModal(tvShowName)}>
          {displayName}
        </span>
      );
    });
    return (
      <div className='mediaBG' style={styles.container}>
        <Marquee loop={true} hoverToStop={true} text={html}/>
        <div style={{width:'100%', textAlign: '-webkit-right'}}>
          <span style={styles.seeAll} onClick={()=>this.filterByUpcoming()}>
            {this.state.toggle?'See All Shows': 'See All Upcoming'}
          </span>
        </div>
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState){
    let {upComingEpisodes: upComingEpisodes} = this.props,
    {toggle} = this.state;
    let {upComingEpisodes: nextEpisodes} = nextProps,
    {toggle: oldToggle} = nextState;
    return (nextEpisodes!=upComingEpisodes || toggle!=oldToggle);
  }
}

const styles = {
  seeAll:{
    cursor: 'pointer',
    color: 'white',
    position: 'relative',
    width: '170px',
    fontSize: '15px',
    padding: '5px 10px',
    backgroundColor: '#f1c40f',
    fontWeight: 'bold',
    borderRadius: '6px'

  },
  container:{
    padding: '70px 100px 10px',
    display:'grid',
    width:'100%',
    zIndex: 99,
    position: 'fixed'
  }
}

const mapStateToProps = (state) =>{

  let tvShowEpisodes = getTVShowEpisodes(state);
  let upComingEpisodes = getUpcomingShows(tvShowEpisodes);
  let tvShows = getTVShowData(state);
  if(upComingEpisodes.length > 0){
    upComingEpisodes = sortEpisodesByDate(upComingEpisodes);
  }
  return {
    upComingEpisodes,
    tvShows
  };
};

export default connect(
  mapStateToProps,
  null
)(UpcomingEpisodes);