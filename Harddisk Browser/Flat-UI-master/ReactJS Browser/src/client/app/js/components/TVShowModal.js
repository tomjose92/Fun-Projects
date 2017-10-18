import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Radium from 'radium';
import {Images,ModalPosition} from '../constants/images';
import TVShowSeason from './TVShowSeason';
import TVShowEpisodes from './TVShowEpisodes';
import Gap from './common/Gap';
import {getModalMeasures} from '../utils/utils';
import {getCurrentTVShowInfo, getCurrentTVShowEpisodes} from '../selectors/selectors';
import MetaData from './MetaData';

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

  componentDidMount(){
    this.handleKeyPress();
  }

  componentWillUnmount(){
    document.onkeydown = null;
  }  

  handleKeyPress(){
    let self = this;
    document.onkeydown = function(evt) {
      let {tvShow: {index, prev, next}} = self.props;
        evt = evt || window.event;
        if (evt.key == "Escape" || evt.key == "Esc" || evt.keyCode == 27){
            self.handleClose();
        }
        else if(evt.key == "ArrowLeft" || evt.keyCode == 37){
          prev && self.props.navShow(prev, index-1);
        }
        else if(evt.key == "ArrowRight" || evt.keyCode == 39){
          next && self.props.navShow(next, index+1)
        }
    };
  }

  render(){
    let {tvShow: {episodes,  tv_show_tag, tv_show_name, prev, next, index}, currentTVShowInfo, currentTVShowEpisodes:seasons} = this.props;
    let {width} = getModalMeasures();
    if(customStyles.content)
    {
      customStyles.content.width = width;
    }
    if(episodes && seasons.length==0)
    {
      seasons=[{episodes, tv_show_season:'All Episodes'}];  
    }
    return (
       <Modal className='tvShowModal' contentLabel='ShowModal' style={customStyles} isOpen={this.state.isOpen}>
          <div style={styles.titleContainer}>
            {prev && <a style={{cursor:'pointer'}} className='fui-triangle-left-large' onClick={()=>this.props.navShow(prev, index-1)}/>}
            <span style={styles.title}>{tv_show_name}</span>
            {next && <a style={{cursor:'pointer'}} className='fui-triangle-right-large' onClick={()=>this.props.navShow(next, index+1)}/>}
          </div>
          <div style={styles.imageContainer}>
            <img id='modal_image' 
              style={Object.assign({},styles.image,Images[tv_show_tag],ModalPosition[tv_show_tag])} 
            />
          </div>
          {seasons && <TVShowSeason showName={tv_show_name} seasons={seasons} />}
          {currentTVShowInfo && <MetaData data={currentTVShowInfo} />}
          <div style={styles.close} onClick={()=>this.handleClose()}>&#10005;</div>
       </Modal>
    );
  }
}

const customStyles = {
  overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex:1001,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center'
  },
  content: {
    outline: 'none',
    borderRadius: '5px',
    backgroundColor: 'rgba(0,0,0,0.945)',
    width: '1060px',
    left: '0px',
    height: '550px',
    margin: '0px auto',
    marginTop: '55px',
    right: 0,
    bottom: 0,
    position: 'relative',
    padding: '0px',
    overflow: 'overlay'
  }
}

const styles={
  titleContainer: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center'
  },
  title: {
    padding: '0px 100px',
    fontSize: '30px',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'fantasy' 
  },
  imageContainer: {
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    marginTop: '50px',
  },
  image:{
    height: '498px',
    width: '450px',
    backgroundSize: '2292px 2536px',
    backgroundRepeat: 'no-repeat'
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

const mapStateToProps = (state) =>{
  let currentTVShowInfo = getCurrentTVShowInfo(state);
  let currentTVShowEpisodes = getCurrentTVShowEpisodes(state);
  return {
    currentTVShowInfo,
    currentTVShowEpisodes
  };
};

export default Radium(connect(
  mapStateToProps,
  null
)(TVShowModal));

