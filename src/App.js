import randomColor from 'randomcolor';
import React from 'react';
import { FaQuoteLeft, FaTwitter, FaTumblr } from "react-icons/fa";
// import styled from 'styled-components';

import './App.css';

class QuotePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageColor: randomColor({luminosity: "dark"})
    }
    this.changeColor = this.changeColor.bind(this);
  }

  changeColor() {
    this.setState({
      pageColor: randomColor({luminosity: "dark"})
    });
  }

  componentDidMount () {
      const script = document.createElement("script");
      script.src = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";
      script.async = true;
      document.body.appendChild(script);
  }

  render() {
    const pageStyle = {
      width: "100vw",
      height: "100vh",
      backgroundColor: this.state.pageColor,
      color: this.state.pageColor,
      display: "flex"
    }

    return (
      <div style={pageStyle}>
        <QuoteBox
          background={this.state.pageColor}
          colorAction={this.changeColor}
        />
      </div>
    )
  }
}

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      author: "",
      update: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate (nextProps, nextState) {
   return nextState.update;
  }

  componentDidMount() {
    this.updateQuote()
  }

  componentDidUpdate() {
    this.setState({ update: false })
  }

  updateQuote() {
    return (
      fetch('https://api.quotable.io/random')
        .then((res) => res.json())
        .then((data) => this.setState({
            content: data.content,
            author: data.author
          }))
    );
  }

  handleClick() {
    this.setState({ update: true });
    this.updateQuote()
      .then(this.props.colorAction());
  }

  render() {
    if (this.state.content === "") {
      return <div />
    }

    const quoteBoxStyle = {
      width: "75vw",
      maxWidth: 500,
      margin: "auto",
      padding: "5vw",
      backgroundColor: "white",
      borderRadius: 5
    }

    return (
      <div id="quote-box" style={quoteBoxStyle}>
        <Quote quote={this.state.content}/>
        <Author author={this.state.author}/>
        <ButtonGroup
          background={this.props.background}
          action={this.handleClick}
          quote={this.state.content}
          author={this.state.author}
        />
      </div>
    );
  }
};

class ButtonGroup extends React.Component {
  render() {
    const buttonGroupStyle = {
      display: "flex",
      justifyContent: "space-between"
    }

    return (
      <div style={buttonGroupStyle}>
        <div id="linkBoxes">
          <Button
            background={this.props.background}
            buttonIcon= {<FaTwitter />}
            aElement={true}
            href={GenerateTweet(this.props.quote, this.props.author)}
          />
          <Button
            background={this.props.background}
            buttonIcon= {<FaTumblr />}
            aElement={true}
            href={GenerateTumblr(this.props.quote, this.props.author)}
          />
        </div>
        <div id="actionBox">
          <Button
            background={this.props.background}
            id="new-quote"
            buttonIcon={"New Quote"}
            getQuote={this.props.action}
          />
        </div>
       </div>
    )
  }
}

const GenerateTweet = (quote, author) => {
  const tweet_base = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="
  return [tweet_base, '"', quote, '" ', author].join('')
}

const GenerateTumblr = (quote, author) => {
  const tumblr_base = "https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption="
  const tumblr_end = "&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button"
  return [tumblr_base, author, "&content=", quote, tumblr_end].join("")
}

class Button extends React.Component {
  render() {
    const buttonStyle = {
      backgroundColor: this.props.background,
      color: "white",
      border: "none",
      borderRadius: 2,
      height: 42,
      minWidth: 42,
      margin: 2,
      fontSize: ".9em"
    }

    if (this.props.aElement === true) {
      return (
          <button style={buttonStyle}>
            <a
              id="tweet-quote"
              href={this.props.href}
              target="_blank"
              rel="noreferrer"
              style={{color:"white"}}
            >
              {this.props.buttonIcon}
            </a>
          </button>
        );
    } else {
      return (
          <button
            style={buttonStyle}
            onClick={this.props.getQuote}
          >
            {this.props.buttonIcon}
          </button>
        );
    }
  }
}

const Quote = (props) => {
  const quoteStyle = {
    fontSize: "1.5em",
    textAlign: "left"
  }
  return (
    <p id="text" style={quoteStyle}>
      <FaQuoteLeft size=".66em" style={{ margin: 5 }}/>
      {props.quote}
    </p>
  );
}

Quote.defaultProps = {
  quote: "It's like a default..."
}

const Author = (props) => {
  const authorStyle = {
    textAlign: "right",
    fontSize: ".9em"
  }
  return (
    <p id="author" style={authorStyle}>
      -{props.author}
    </p>
  );
}

Author.defaultProps = {
  author: "Django Django"
}


function App() {
  return (
    <div className="App">
      <QuotePage />
    </div>
  );
}

export default App;
