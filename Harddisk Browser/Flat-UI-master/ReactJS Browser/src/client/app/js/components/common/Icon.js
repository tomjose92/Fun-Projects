import React from 'react';

const Icon = (props) =>{
  let {src,style} = props;
  let newStyles = Object.assign({},styles.icon,style);
  return (
    <img {...props} style={newStyles} />
  );
}

const styles = {
  icon:{
    width: '32px',
    height: '32px'
  }
};

export default Icon;
