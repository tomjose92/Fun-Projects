import React from 'react';
import Link from './common/Link';
import Space from './common/Space';
import Icon from './common/Icon';
import {getEpisodesWidth} from '../utils/utils';

class TVShowEpisodes extends React.Component {

  render()
  {
    let self=this,
    {displayEpisodes, episodes} = this.props,
    showEpisodes = (displayEpisodes==null)?"none":displayEpisodes;
    if(styles.episodeScroll)
    {
      styles.episodeScroll.width = getEpisodesWidth();
    }

    let tvShowEpisodes = episodes.map(function(episode,k){
      let {tv_show_episode, number, summary, color, date} = episode;
      let episodeName = (
        <span>
          <span style={{color}}>Episode {number} : &nbsp;</span>
          <span>{tv_show_episode} &nbsp; ({date})</span>
        </span>
      );
      return (
        <div key={"episode"+k} >
          <div style={styles.container} className="fui-arrow-right">
            <Link title={summary} style={{marginLeft:'10px', color:'white'}} content={episodeName} />
            {/*<Space space='space20' /><a href=""> <Icon src="img/icons/svg/tv.svg"/></a>
            <Space space='space20' /><a href=""> <Icon src="img/icons/svg/closed-captioning.svg"/></a>*/}
          </div>
        </div>
      );
    });
    let newStyles = Object.assign({},styles.episodeScroll,{display:showEpisodes});
    return <div style={newStyles} className="episodeScroll">{tvShowEpisodes}</div>
  }
}

const styles={
  episodeScroll:{
    width: '800px',
    height: '200px',
    overflowY: 'scroll',
    borderWidth: '10px',
    borderStyle: 'dashed',
    borderColor: 'white',
    borderRightWidth: '0px',  
    backgroundColor: 'black',
    margin: '0px 20px',
    position: 'relative',
    zIndex: '1000'
  },
  container:{
    paddingTop: '10px',
    marginLeft: '10px',
    whiteSpace: 'nowrap',
    paddingBottom: '10px',
  }

}

export default TVShowEpisodes;