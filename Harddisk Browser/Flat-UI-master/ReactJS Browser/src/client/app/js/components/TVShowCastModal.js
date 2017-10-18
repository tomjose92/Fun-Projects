import React, {Component} from 'react';
import Modal from 'react-modal';
import Radium from 'radium';
import Gap from './common/Gap';
import {getModalMeasures} from '../utils/utils';

class TVShowCastModal extends Component {
  constructor(){
    super();
    this.state={
      isOpen: true
    };
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
        evt = evt || window.event;
        if (evt.key == "Escape" || evt.key == "Esc" || evt.keyCode == 27){
            self.handleClose();
        }
    };
  }

  handleClose(){
    this.setState({
      isOpen: false
    });
    this.props.callback();
  }

  changeImage(key, flip){
    let {casts} = this.props;
    let {stateCasts} = this.state;
    let finalCasts = stateCasts || casts;
    let cast = finalCasts[key];
    if(flip)
    {
      cast = {...cast, image: cast.realImage};
    }
    else
    {
      cast = {...cast, image: cast.characterImage};
    }
    finalCasts[key] = cast;
    this.setState({
      stateCasts: finalCasts
    });

  }
  
  render(){
    let {casts, tvShowName} = this.props;
    let {stateCasts} = this.state;
    let finalCasts = stateCasts || casts;
    let self=this;
    let {width} = getModalMeasures();
    if(customStyles.content)
    {
      customStyles.content.width = width;
    }   
    let castsHTML = finalCasts.map(function(cast, index){
      let {image, realName, characterName, characterImage} = cast;
      let finalImage = image || characterImage;
      return (
        <span key={index} style={{paddingRight: '50px'}}> 
          <div style={styles.labelContainer}>
            <span style={styles.label}>Name:</span> &nbsp; <span style={styles.value}>{realName}</span>
          </div>
          <div style={styles.labelContainer}>
            <span style={styles.label}>Character Name:</span> &nbsp; <span style={styles.value}>{characterName}</span>
          </div>
          <img src={finalImage} 
            onMouseOver={()=>self.changeImage(index, true)}
            onMouseOut={()=>self.changeImage(index, false)}
          />
        </span>
      ) 
    });
    return (
       <Modal className='tvShowModal' contentLabel='CastModal' style={customStyles} isOpen={this.state.isOpen}>
          <div style={styles.titleContainer}>
            <span style={styles.title}>{tvShowName}</span>
          </div>
          <div style={{display: 'inline-flex', paddingTop: '100px'}}>{castsHTML}</div>
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
    position: 'fixed',
    width: '100%',
    textAlign: 'center',
    left: 'inherit'
  },
  title: {
    padding: '0px 100px',
    fontSize: '30px',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'fantasy' 
  },
  value:{
    color: 'white'
  },
  label:{
    color: 'blue',
    fontWeight: 'bold'
  },
  labelContainer:{
    whiteSpace:'nowrap'
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
    position: 'fixed',
    right: '130px',
    top: '53px',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    textShadow: 'none',
  }
};

export default Radium(TVShowCastModal);

