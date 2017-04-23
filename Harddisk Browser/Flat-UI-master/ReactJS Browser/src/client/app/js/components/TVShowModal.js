import React, {Component} from 'react';
import Modal from 'react-modal';
import Radium from 'radium';
import {Images} from '../constants/images';
import TVShowSeason from './TVShowSeason';
import TVShowEpisodes from './TVShowEpisodes';
import Gap from './common/Gap';
import {getModalMesaures} from '../utils/utils';

class TVShowModal extends Component {
  constructor(){
    super();
    this.state={
      isOpen: true
    };
  }
  handleClose(){
    this.setState({
      isOpen: false
    });
    this.props.callback();
  }

  render(){
    let {tvShow: {episodes, seasons, tv_show_tag, tv_show_name}} = this.props;
    let imageUrl = Images[tv_show_tag];
    let {marginLeft, width} = getModalMesaures();
    if(customStyles.content)
    {
      customStyles.content.marginLeft = marginLeft;
      customStyles.content.width = width;
    }

    return (
       <Modal className='tvShowModal' contentLabel='ShowModal' style={customStyles} isOpen={this.state.isOpen}>
          <div style={styles.title}>{tv_show_name}</div>
          <img id='modal_image' style={styles.image} src={imageUrl} />
          {(episodes && seasons.length==0) && (
            <div style={{position: 'absolute'}}>
              <Gap padding='padding100'/>
              <TVShowEpisodes displayEpisodes='block' episodes={episodes} />
            </div>
          )}
          {seasons && <TVShowSeason seasons={seasons} />}
          <div style={styles.close} onClick={()=>this.handleClose()}>&#10005;</div>
       </Modal>
    );
  }
}

const customStyles = {
  overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex:1001
  },
  content: {
    outline: 'none',
    borderRadius: '5px',
    backgroundColor: 'rgba(0,0,0,0.945)',
    width: '1060px',
    left: '0px',
    top: '160px',
    marginLeft: '100px',
    height: '550px',
    top: '80px',
    right: 0,
    bottom: 0,
    position: 'relative',
    padding: '0px',
  }
}

const slideAnimation = Radium.keyframes({
  '0%':  {left:'0px'},
  '25%': {left:'610px'},
  '50%': {left:'265px'},
  '100%': {left:'300px'}
});

const styles={
  title: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: '30px',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'fantasy' 
  },
  image:{
    height: '498px',
    width: '450px',
    position: 'absolute',
    left: '300px',
    top: '50px',
    animation: 'x 2s',
    animationName: slideAnimation
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
  }
};

export default Radium(TVShowModal);