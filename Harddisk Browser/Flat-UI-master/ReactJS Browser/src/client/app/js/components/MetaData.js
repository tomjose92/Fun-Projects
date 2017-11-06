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
    let {data: {genres=[], status, runtime, name, rating}, casts=[], tvShowName} = this.props;
    genres = genres.join(', ').replace(/,(?!.*,)/gmi, ' and');
    return (
       <div style={styles.container}>
        {rating && <div>
          <span style={styles.label}>Rating:</span>
          &nbsp; 
          <span style={styles.value}>{rating.average}</span>
        </div>}
        {status && <div>
          <span style={styles.label}>Status:</span>
          &nbsp; 
          <span style={styles.value}>{status}</span>
        </div>}
        {runtime && <div>
          <span style={styles.label}>RunTime:</span>
          &nbsp; 
          <span style={styles.value}>{runtime} mins</span>
        </div>}
        {genres && <div>
          <span style={styles.label}>Genre:</span>
          &nbsp; 
          <span style={styles.value}>{genres}</span>
        </div>}
        {casts.length>0 && 
          <div><a onClick={()=>this.openModal()}>See Cast</a>
            {this.state.open && <TVShowCastModal tvShowName={tvShowName} casts={casts} callback={()=>this.closeModal()}/>}
          </div>
        }
       </div>
    );
  }
}

const styles={
  container:{
    position: 'relative',
    float: 'right',
    top: '150px',
    fontSize: '20px',
    textAlign: 'left',
    width: '25%',
    paddingRight: '25px'
  },
  label: {
    color: 'blue',
    fontWeight: 'bold'
  },
  value:{
    color: 'white'
  }
};

export default MetaData;

