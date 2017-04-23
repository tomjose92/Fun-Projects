import React from 'react';
import Space from './Space';
import Radium from 'radium';
import {getLoadingLeft} from '../../utils/utils';
class Header extends React.Component {

    constructor() {
      super();
      this.state = {
        letterArray:[],
        displayData:'none'
      };
    }

    displayLoader(){
      let {loading} = this.props,
      value = (loading)?"block":"none";
      return value;
    }

    fetchLetterList(){
      let dataArray = [];
      for (let idx='A'.charCodeAt(0),end='Z'.charCodeAt(0); idx <=end; ++idx){
        dataArray.push(String.fromCharCode(idx));
      }
      return dataArray;
    }  

    componentDidMount() {
      let display = this.props.isNormal!==undefined?"none":"block";
      this.setState({
        displayData: display
      });
    }

  	render() {
      let headerText = "Tom's Media",
      {app, isNormal, isLocal, displayData} = this.props;
      if(isNormal===undefined)
      {
        headerText+=" > ";
      }

      let text = (
          <span title="Click here to refresh">
            Refresh
          </span>
        );
      if(isLocal)
      {
        text = (<span title="Click here to access online">Online</span>);
      }
      let dynamicLoadingStyle = {display: this.displayLoader(), marginLeft: getLoadingLeft()};
      let loadingStyle = Object.assign({},styles.loadingContainer,dynamicLoadingStyle);
      var loadingLink = (
      <div> 
        {!isNormal && (
          <div style={styles.buttonContainer}>
            <button onClick={() => this.props.onRefresh()} style={styles.button} >
              {text}            
            </button>
          </div>
        )}
        <div style={loadingStyle}>
          <span style={{color:"white"}}>
            <h4 style={{textAlign:'center'}}>Loading...</h4>
          </span>
          <div><img style={styles.loading} src="img/circle.gif"/></div>
        </div>
      </div>
      );

    	let letters = this.fetchLetterList();
      let defaultLetter = function(){
        if(app!=null && app=="Movies")
        {
          return 
          <span >
            <Space space='space10' />
            <a style={styles.letterFont} href="#0123">0123</a>
          </span>
        }
        else
        {
          return "";
        }
      }

    	let lettersLink = letters.map(function(letter,i){
      	return (
          <span key={"letter"+ i}>
            <Space space='space20' />
            <a key={'letter' + i} style={styles.letterFont} href={"#" +letter}>{letter}</a>
          </span>
      	);
    	});
      
      if(app!="Movies")
      {
        lettersLink="";
      }

	    return (
        <div style={styles.container}>
          <nav style={styles.topBanner} className="navbar navbar-inverse navbar-embossed" role="navigation">
            <div className="navbar-header">
              <a href="#" className="ffCur fs25 navbar-brand">{headerText}</a>
              <a style={{marginTop:'-4px'}} className="plno pt20 ffCur fs20 navbar-brand" href="#">{app}</a>
            </div>
            
            <div style={Object.assign({},styles.letterBox,{display:displayData})} >
              <ul style={styles.pagination}> 
                <Space space='space20'/>
                {defaultLetter()}
                {lettersLink}
              </ul>
            </div>  
          </nav>
          <div style={{display:displayData}}>{loadingLink}</div>
        </div>
      );
  	}
};

const styles={
  container: {
    zIndex: '100',
    position: 'fixed'
  },
  topBanner:{
    width:'100%',
    position: 'fixed',
  },
  loadingContainer:{
    position: 'fixed',
    marginTop: '200px',
  },
  loading: {
    width: '200px',
    height: '200px'
  },
  letterFont:{
    color: 'black',
    fontFamily: 'initial',
    fontSize: '18px',
    ':hover':{
      color: 'white',
      textDecoration: 'none'
    }
  },
  letterBox:{
    marginBottom: '-15px',
    marginTop: '-8px',
    marginLeft:'100px'
  },
  pagination:{
    backgroundColor: '#d6dbdf',
    color: '#ffffff',
    padding: '0px 20px 0px 0px',
    borderRadius: '6px',
    display: 'inline-block',
    margin: '20px 0px'
  },
  buttonContainer: {
    position: 'fixed',
    right: '0px',
    padding: '4px 35px'
  },
  button: {
    borderRadius: '50%',
    backgroundColor: '#555555', 
    border: 'none',
    color: 'white',
    padding: '5px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '5px -25px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'white',
      color: 'black'
    },
    ':active': {
      backgroundColor: 'white',
      boxShadow: '0 5px #666',
      transform: 'translateY(4px)'
    }
  } 
}
export default Radium(Header);