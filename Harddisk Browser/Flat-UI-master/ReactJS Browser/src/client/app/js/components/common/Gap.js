import React from 'react';

const Gap = (props) =>{
	let {padding} = props;
  	return (
   	<div style={styles[padding]}></div >
  );
}

const styles = {
  padding15:{
    paddingTop: '15px'
  },
  padding20:{
    paddingTop: '20px' 
  },
  padding40 :{
    paddingTop: '40px'
  },
  padding60 :{
    paddingTop: '60px'
  },
  padding100: {
    paddingTop: '100px' 
  }
};

export default Gap
