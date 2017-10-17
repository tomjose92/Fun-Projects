import React, {Component} from 'react';

class MetaData extends Component {
  constructor(){
    super();
  }

  render(){
    let {data: {genres=[], status, runtime, name, rating}} = this.props;
    let genresHTML = genres.map(function (genre) {
      return (<span style={styles.value} key={genre}>&nbsp; {genre}, </span>);
    });
    return (
       <div style={styles.container}>
        {rating && <div>Rating: &nbsp; <span style={styles.value}>{rating.average}</span></div>}
        {status && <div>Status:&nbsp; <span style={styles.value}>{status}</span></div>}
        {runtime && <div>RunTime: &nbsp; <span style={styles.value}>{runtime} mins</span></div>}
        {genresHTML && <div>Genre: <span>{genresHTML}</span></div>}
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

