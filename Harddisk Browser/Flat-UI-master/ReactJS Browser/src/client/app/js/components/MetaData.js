import React, {Component} from 'react';
import TVShowCastModal from './TVShowCastModal';

class MetaData extends Component {
  constructor(){
    super();
    this.state ={
      open:false
    };
  }

  closeModal(){
    this.setState({
      open: false
    });
    this.props.handleKey();
  }

  openModal(){
    this.setState({
      open: true
    });
  }

  render(){
    let {data: {genres=[], status, runtime, name, rating}, casts, tvShowName} = this.props;
    genres = genres.join(', ').replace(/,(?!.*,)/gmi, ' and');
    return (
       <div style={styles.container}>
        {rating && <div>Rating: &nbsp; <span style={styles.value}>{rating.average}</span></div>}
        {status && <div>Status:&nbsp; <span style={styles.value}>{status}</span></div>}
        {runtime && <div>RunTime: &nbsp; <span style={styles.value}>{runtime} mins</span></div>}
        {genres && <div>Genre: &nbsp; <span style={styles.value}>{genres}</span></div>}
        {casts && 
          <div><a onClick={()=>this.openModal()}>See Cast</a>: &nbsp; 
            {this.state.open && <TVShowCastModal tvShowName={tvShowName} casts={casts} callback={()=>this.closeModal()}/>}
          </div>
        }
       </div>
    );
  }
}

const styles={
  container:{
    position: 'absolute',
    right: '0px',
    top: '150px',
    paddingRight: '30px',
    fontSize: '20px',
    textAlign: 'left',
    width: '30%'
  },
  value:{
    color: 'white'
  }
};

export default MetaData;

