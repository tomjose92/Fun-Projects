import React from 'react';

const Link = (props) =>{
  let {name,content,className,style,title,href} = props;
  let newStyles = Object.assign({},styles.link,style);
  return (
    <a {...props} style={newStyles}>
      {content}
    </a>
  );
}

const styles = {
  link:{
    outline: 'none',
    color: '#4044c6',
    cursor: 'pointer',
    fontFamily: 'fantasy',
    fontSize: '20px'
  }
};

export default Link;
