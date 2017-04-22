import React from 'react';

const Space = (props) =>{
	let {space} = props;
  	return (
   	<span style={styles[space]}></span>
  );
}

const styles = {
	space5:{
    	width: '5px',
    	display: 'inline-block'
  	},
	space10:{
    	width: '10px',
    	display: 'inline-block'
  	},
  	space20:{
    	width: '20px',
    	display: 'inline-block'
  	},
  	space25:{
   	 	width: '25px',
    	display: 'inline-block'
  	}
};

export default Space;
