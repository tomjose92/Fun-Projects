import React, {Component} from 'react';

class MetaData extends Component {
  constructor(){
    super();
  }

  render(){
    let {data: {genres=[], status, runtime, name, rating}} = this.props;
    genres = genres.join(', ').replace(/,(?!.*,)/gmi, ' and');
    return (
       <div style={styles.container}>
        {rating && <div>Rating: &nbsp; <span style={styles.value}>{rating.average}</span></div>}
        {status && <div>Status:&nbsp; <span style={styles.value}>{status}</span></div>}
        {runtime && <div>RunTime: &nbsp; <span style={styles.value}>{runtime} mins</span></div>}
        {genres && <div>Genre: <span style={styles.value}>{genres}</span></div>}
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

