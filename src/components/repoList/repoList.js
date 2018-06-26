import React, { Component } from 'react';
import { Container } from 'reactstrap';
import GitCards from '../gitCards/gitCards';
import './repoList.css';

/**
 * Display the github repository data in a Cards based grid view
 */
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
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const threshold = 100;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight + threshold) >= scrollHeight;
    // console.log(scrollTop, scrollHeight, clientHeight, scrolledToBottom);
    if (scrolledToBottom) {
      this.props.onLoadMore();
    }
  }

  render() {
    const { data } = this.props;
    const cards = data.organization ? (
      <GitCards repositories={data.organization.repositories} />
    ) : (
      <div />
    );
    return <Container>{cards}</Container>;
  }
}

export default RepoList;
