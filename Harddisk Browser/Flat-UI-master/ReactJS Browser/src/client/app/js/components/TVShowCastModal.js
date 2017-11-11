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
      let {image, realName, characterName, characterImage, realImage, otherShows} = cast;
      if(otherShows)
      {
        otherShows = 'Also in ' + otherShows.join(', ').replace(/,(?!.*,)/gmi, ' and')  
      }
      
      let finalImage = image || characterImage || realImage;
      return (
        <span key={index} style={{paddingRight: '50px'}}> 
          <div style={styles.labelContainer}>
            <span style={styles.label}>Character Name:</span> &nbsp; <span style={styles.value}>{characterName}</span>
          </div>
          <div style={styles.labelContainer}>
            <span style={styles.label}>Name:</span> &nbsp; <span style={styles.value}>{realName}</span>
            {otherShows && <span style={styles.info} title={otherShows} className="fui-info-circle"></span>}
          </div>
          <img src={finalImage} 
            onMouseOver={()=>self.changeImage(index, true)}
            onMouseOut={()=>self.changeImage(index, false)}
          />
        </span>
      ) 
    });
    return (
       <Modal className='scroll-green tvShowModal' contentLabel='CastModal' style={customStyles} isOpen={this.state.isOpen}>
          <div style={styles.titleContainer}>
            <span style={styles.title}>{tvShowName}</span>
          </div>
          <div style={styles.casts}>{castsHTML}</div>
          <div style={styles.closeContainer}>
            <div style={styles.close} onClick={()=>this.handleClose()}>Close</div>
          </div>
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
  info:{
    marginLeft: '15px',
    color: 'white',
    cursor: 'pointer'
  },
  casts:{
    display: 'inline-flex',
    paddingTop: '100px',
    paddingLeft: '20px'
  },
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
  closeContainer:{
    width: '100%',
    display:'inline-block', 
    marginTop: '20px'
  },
  close:{
    background: '#56544D',
    color: '#CEC9BE',
    cursor: 'pointer',
    fontFamily: 'times new roman',
    fontSize: '20px',
    lineHeight: '30px',
    position: 'fixed',
    width: '60px',
    display: 'inline-table'
  }
};

export default Radium(TVShowCastModal);

