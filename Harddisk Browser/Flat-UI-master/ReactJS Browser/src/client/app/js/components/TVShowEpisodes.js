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
      return (
        <div key={"episode"+k} >
          <div style={styles.container} className="fui-arrow-right">
            <Link title={episode.tooltip} style={{marginLeft:'10px', color:'white'}} content={episode.tv_show_episode} />
            <Space space='space20' /><a href=""> <Icon src="img/icons/svg/tv.svg"/></a>
            <Space space='space20' /><a href=""> <Icon src="img/icons/svg/closed-captioning.svg"/></a>
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
    backgroundColor: 'black'
  },
  container:{
    paddingTop: '20px',
    marginLeft: '10px',
    whiteSpace: 'nowrap'
  }

}

export default TVShowEpisodes;