import React from 'react';
import {connect} from 'react-redux';
import Marquee from 'react-text-marquee';
import {getTVShowEpisodes, getTVShowData} from 'selectors';
import {sortEpisodesByDate, stripHTMLFromText, getUpcomingShows} from '../utils/utils';

class UpcomingEpisodes extends React.Component {
  render(){
    let {upComingEpisodes, tvShows} = this.props;
    if(upComingEpisodes.length > 0){
      upComingEpisodes = sortEpisodesByDate(upComingEpisodes);
    }
    let self = this;
    let html = upComingEpisodes.map(function(episode, index){
      let {tvShowName, episode:{summary, color, date, season, number, name}} = episode;
      let displayName = `${tvShowName} : S${season}E${number} ${name} (${date})`;
      let tvShow = tvShows.find(function(tvShow){
        return tvShow.tv_show_name == tvShowName
      });
      return (
        <span style={{color, padding:'0px 30px', cursor: 'pointer'}} 
          key={index} title={stripHTMLFromText(summary) || ''}
          onClick={()=>self.props.showModal(tvShow)}>
          {displayName}
        </span>
      );
    });
    return (
      <div className='mediaBG' style={styles.container}>
        <Marquee loop={true} hoverToStop={true} text={html}/>
      </div>
    )
  }
}

const styles = {
  container:{
    paddingTop: '70px',
    paddingBottom: '10px', 
    display:'grid',
    width:'90%',
    marginLeft: '100px',
    zIndex: 99,
    position: 'fixed'
  }
}

const mapStateToProps = (state) =>{

  let tvShowEpisodes = getTVShowEpisodes(state);
  let upComingEpisodes = getUpcomingShows(tvShowEpisodes);
  let tvShows = getTVShowData(state);
  return {
    upComingEpisodes,
    tvShows
  };
};

export default connect(
  mapStateToProps,
  null
)(UpcomingEpisodes);