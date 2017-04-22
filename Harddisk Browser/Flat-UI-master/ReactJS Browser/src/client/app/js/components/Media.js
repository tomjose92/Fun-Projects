import React from 'react'
import Header from './common/Header'
import Gap from './common/Gap'
import Link from './common/Link'
import Icon from './common/Icon'

class MediaHTML extends React.Component {
  constructor(){
    super();
    document.body.className="mediaBG";
  }
	render(){
		return (
			<div className="mediaBG">
      	<Header isNormal={true}/>
      	<Gap padding='padding100' />
      	<li style={styles.margin}>
          <Link style={{color:'white',fontFamily:'Sans'}} href='#Movies' content='Movies' />
        	<Icon style={{margin:'-35px 50px'}} src="img/icons/svg/video-player.svg"/>
      	</li>
			  <li style={Object.assign({},styles.margin,styles.padding)}>
          <Link style={{color:'white',fontFamily:'Sans'}} href='#TVShow' content='TV Series' />
        	<Icon style={{margin:'-35px 25px'}} src="img/icons/svg/television.svg"/>
      	</li>
      	<Gap padding='padding100' />
		  </div>
		);
	}
};

const styles = {
  margin:{
    marginLeft: '50px'
  },
  padding:{
    paddingTop: '40px'
  }
}
export default MediaHTML;