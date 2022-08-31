import randomColor from 'randomcolor';
import React from 'react';
import { FaQuoteLeft, FaTwitter, FaTumblr } from "react-icons/fa";
// import styled from 'styled-components';

import './App.css';

class QuotePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageColor: randomColor({luminosity: "dark"}),
      content: "",
      author: ""
    }
    this.handleClick = this.handleClick.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }

  changeColor() {
    this.setState({
      pageColor: randomColor({luminosity: "dark"})
    });
  }

  componentDidMount() {
    this.updateQuote()
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
    this.updateQuote()
      .then(this.changeColor());
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
          content={this.state.content}
          author={this.state.author}
          handleClick={this.handleClick}
        />
      </div>
    )
  }
}

function QuoteBox (props) {
  if (props.content === "") {
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
      <Quote quote={props.content}/>
      <Author author={props.author}/>
      <ButtonGroup
        background={props.background}
        action={props.handleClick}
        quote={props.content}
        author={props.author}
      />
    </div>
  );
};

function ButtonGroup (props) {
  const buttonGroupStyle = {
    display: "flex",
    justifyContent: "space-between"
  }

  return (
    <div style={buttonGroupStyle}>
      <div id="linkBoxes">
        <Button
          background={props.background}
          buttonIcon= {<FaTwitter />}
          aElement={true}
          href={GenerateTweet(props.quote, props.author)}
          id="tweet-quote"
        />
        <Button
          background={props.background}
          buttonIcon= {<FaTumblr />}
          aElement={true}
          href={GenerateTumblr(props.quote, props.author)}
          id="tumblr-quote"
        />
      </div>
      <div id="actionBox">
        <Button
          background={props.background}
          id="new-quote"
          buttonIcon={"New Quote"}
          getQuote={props.action}
        />
      </div>
     </div>
  )
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

function Button (props) {
  const buttonStyle = {
    backgroundColor: props.background,
    color: "white",
    border: "none",
    borderRadius: 2,
    height: 42,
    minWidth: 42,
    margin: 2,
    fontSize: ".9em"
  }

  if (props.aElement === true) {
    return (
        <button style={buttonStyle}>
          <a
            id={props.id}
            href={props.href}
            target="_blank"
            rel="noreferrer"
            style={{color:"white"}}
          >
            {props.buttonIcon}
          </a>
        </button>
      );
  } else {
    return (
        <button
          id={props.id}
          style={buttonStyle}
          onClick={props.getQuote}
        >
          {props.buttonIcon}
        </button>
      );
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
