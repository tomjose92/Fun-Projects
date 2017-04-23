import React from 'react';
import TVShowEpisodes from './TVShowEpisodes'
import Link from './common/Link'
import Gap from './common/Gap'

class TVShowSeason extends React.Component{
    constructor(){
      super();
      this.state = {
        change:false,
      };
    }
    
    toggleEpisodes(index){
      let {seasons} = this.props,
      display = seasons[index].showEpisodes;
      this.hideSeasons();
      if(display===undefined || display=="none")
      {
        seasons[index].showEpisodes="block"; 
        document.getElementById('modal_image').className='blur';
      }
      else
      {
        document.getElementById('modal_image').className='';
        seasons[index].showEpisodes="none";  
      }
      this.setState({change:true});
    }

    render()
    {
      let self=this,
      {seasons} = this.props;  

      let tvShowSeasons = seasons.map(function(season,i){ 
        return (
          <div key={"season"+i} style={styles.container} className={season.showEpisodes=='block'?'fui-radio-checked':'fui-radio-unchecked'}>
            <Link style={{color:'white',marginLeft: '20px'}} onClick={()=>self.toggleEpisodes(i)} content={season.tv_show_season} />
            <TVShowEpisodes episodes={season.episodes} displayEpisodes={season.showEpisodes}/>
          </div>
        );
      });
      return (
        <div style={{position: 'absolute'}} className='tvShowSeasons'>
          <Gap padding='padding100' />
          {tvShowSeasons}
        </div>)
    }

    hideSeasons(){
      let {seasons} = this.props; 
      seasons.map(function(season){season.showEpisodes='none';});
    }

    componentWillUnmount(){
      this.hideSeasons();
    }
};

const styles={
  container:{
    paddingTop: '20px',
    marginLeft: '50px',
    whiteSpace: 'nowrap'
  }
}

export default TVShowSeason;