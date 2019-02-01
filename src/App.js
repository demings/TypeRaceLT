import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Rašymo lenktynės</h1>

          <GivenTextComp />

        </header>
      </div>
    );
  }
}

class GivenTextComp extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      givenText: '',
      typedText: '',
      correctText: '',
      errorText: '',
      uncompletedText: ''
    };
    
    
    // this.findtext = this.findtext.bind(this);
    //this.getJSONP = this.getJSONP.bind(this);
    
    this.findtext();
    this.setStrings = this.setStrings.bind(this);
  }

  async findtext(){
    // http://www.pipedija.com/index.php/Specialus:Atsitiktinis_puslapis
    // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Stack%20Overflow

    // https://en.wikipedia.org/api/rest_v1/page/summary/Stack_Overflow
    try {
      let response = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Stack_Overflow');
      let responseJson = await response.json();
      this.setState({givenText: responseJson.extract});
      this.setState({uncompletedText: responseJson.extract});
     } catch(error) {
      console.error(error);
    }
  }

  setStrings(typedValue){
    this.setState({typedText: typedValue})
    var typedChars = typedValue.split('');
    var givenChars = this.state.givenText.split('');
    var correctChars = [];
    var incorrectChars = [];
    var uncompletedChars = [];

    var i = 0

    for(i = 0; i < typedChars.length; i++){
      if(typedChars[i] === givenChars[i]){
        correctChars.push(givenChars[i]);
      }else{
        incorrectChars.push(givenChars[i]);
        i++;
        break;
      }
    }

    for(var u = i; u < givenChars.length; u++){
      uncompletedChars.push(givenChars[u]);
    }
    
    this.setState({correctText: correctChars.join("")})
    this.setState({errorText: incorrectChars.join("")})
    this.setState({uncompletedText: uncompletedChars.join("")})
    this.render()
  }

  render(){
    return(
      <div class="form-group col-lg-4">

        <div class="noselect">
          <text class="text-success">
            {this.state.correctText}
          </text>
          <text class="text-danger">
            {this.state.errorText}
          </text>
          <text class="text-primary">
            {this.state.uncompletedText}
          </text>
        </div>

        <TypingForm onSetStrings={this.setStrings}/>
      </div>
    );
  }
}

class TypingForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      writtenText: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(){
    // alert('changed ' + this.refs.TypedText.value);
    this.setState({writtenText: this.refs.TypedText.value})
    this.props.onSetStrings(this.refs.TypedText.value);
  }

  render(){
    return(
      <div class="container" >
          <textarea ref="TypedText" class="form-control input-sm" onChange={this.handleChange}/>
     </div>  
    );
  }
}

export default App;
