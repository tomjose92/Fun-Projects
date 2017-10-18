import React from 'react';
import TVShowEpisodes from './TVShowEpisodes';
import Link from './common/Link';
import Gap from './common/Gap';
import {blurImage} from '../utils/utils';

class TVShowSeason extends React.Component{
    constructor(){
      super();
      this.state = {
        toggle:false,
      };
    }
    
    toggleEpisodes(index){
      let {seasons} = this.props,
      display = seasons[index].showEpisodes;
      this.hideSeasons();
      if(display===undefined || display=="none")
      {
        seasons[index].showEpisodes="block"; 
        blurImage(true);
        this.setState({toggle:true});
      }
      else
      {
        blurImage(false);
        seasons[index].showEpisodes="none";  
        this.setState({toggle:false});
      }
      
    }

    componentDidUpdate(prevProps){
      let {showName: prevShow} = prevProps,
      {showName: currentShow} = this.props;
      if(currentShow!=prevShow)
      {
        this.hideSeasons();
        this.setState({
          toggle:false
        });
      }
    }

    render()
    {
      let self=this,
      {seasons} = this.props;
      let tvShowSeasons = seasons.map(function(season,i){ 
        let {tv_show_season, year, episodes, showEpisodes} = season;
        let seasonName = 'Season ' + tv_show_season + ' - ' + year; 
        return (
          <div key={"season"+i} style={styles.season} className={showEpisodes=='block'?'fui-radio-checked':'fui-radio-unchecked'}>
            <Link style={{color:'white',marginLeft: '20px'}} onClick={()=>self.toggleEpisodes(i)} content={seasonName} />
            <TVShowEpisodes episodes={episodes} displayEpisodes={showEpisodes}/>
          </div>
        );
      });
      return (
        <div style={styles.container} className='tvShowSeasons'>
          {tvShowSeasons}
        </div>)
    }

    hideSeasons(){
      this.props.seasons.map(function(season){season.showEpisodes='none';});
    }

    componentWillUnmount(){
      this.hideSeasons();
    }
};

const styles={
  container:{
    position: 'absolute',
    marginTop: '100px',
    textAlign: 'left'
  },
  season:{
    paddingTop: '15px',
    marginLeft: '25px',
    whiteSpace: 'nowrap',
    paddingBottom: '5px'
  }
}

export default TVShowSeason;