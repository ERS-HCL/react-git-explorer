import React, { Component } from 'react';
import GitCards from './gitCards';
import { Container } from 'reactstrap';
import './repoList.css';

class RepoList extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll() {
    // Solution based on
    // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
    var scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    var scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    var clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    // console.log(scrollTop, scrollHeight, clientHeight, scrolledToBottom);
    if (scrolledToBottom) {
      this.props.onLoadMore();
    }
  }

  render() {
    const { data } = this.props;
    const cards=(data.organization)? <GitCards repositories={data.organization.repositories} />:<div></div>
    return (
      <Container>
        {cards}
      </Container>
    );
  }
}

export default RepoList;
