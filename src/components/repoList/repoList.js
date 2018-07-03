import React, { Component } from 'react';
import { Container, Alert, Button, Row, Col } from 'reactstrap';
import { CSVLink } from 'react-csv';
import Spinner from '../spinner/spinner';
import GitCards from '../gitCards/gitCards';
import MultiSelect from '../multiSelect/multiSelect';
import DateRangePicker from '../dateRangePicker/dateRangePicker';
import './repoList.css';

const moment = require('moment-timezone');
moment.tz.setDefault('UTC');
/**
 * Display the github repository data in a Cards based grid view
 */
class RepoList extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  state = {
    loading: false,
    filters: [],
    filterStartDate: null,
    filterEndDate: null
  };

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
      this.handleLoadMore();
    }
  }

  handleLoadMore = () => {
    this.setState({
      loading: true
    });
    this.props.onLoadMore().then(result => {
      // False indicates loading already in progress
      if (result !== false) this.setState({ loading: false });
    });
  };

  handleFilter = value => {
    this.setState({
      filters: value
    });
  };

  handleChangeFilterStartDate = value => {
    this.setState({
      filterStartDate: value
    });
  };

  handleChangeFilterEndDate = value => {
    this.setState({
      filterEndDate: value
    });
  };

  statusBar = (
    totalCount,
    totalCurrent,
    csvFileName,
    data,
    showSpinner,
    isHeader
  ) => {
    return (
      <Container>
        <Alert color="light text-secondary" className="my-alert">
          <Row>
            <Spinner
              class={'spinner-black'}
              enabled={
                // Show spinner based on loading attribute and
                // current fetch status
                showSpinner || this.state.loading
              }
              message="Fetching stats .."
            />
            <Col>
              <div className="my-total">
                {totalCount > 0 && (
                  <small>
                    <strong>
                      {totalCurrent}/{totalCount}{' '}
                    </strong>
                  </small>
                )}
                {isHeader &&
                  totalCount !== totalCurrent && (
                    <Button
                      color="light"
                      className="btn btn-secondary"
                      size="sm"
                      onClick={() => this.handleLoadMore()}
                    >
                      <div className="my-forward">
                        <i className="fas fa-forward" /> <small>MORE</small>
                      </div>
                    </Button>
                  )}
              </div>
              {isHeader && totalCount > 0 && <hr />}
              <div className="my-select">
                {isHeader &&
                  totalCount > 0 && (
                    <MultiSelect onChange={this.handleFilter} />
                  )}
              </div>
              {isHeader &&
                totalCount > 0 && (
                  <DateRangePicker
                    onChangeStartDate={this.handleChangeFilterStartDate}
                    onChangeEndDate={this.handleChangeFilterEndDate}
                  />
                )}
            </Col>

            {totalCount > 0 &&
              totalCount === totalCurrent && (
                <Col>
                  <CSVLink
                    className="my-download"
                    data={this.handleDownload(data.organization.repositories)}
                    filename={csvFileName}
                  >
                    <i className="fas fa-cloud-download-alt" />{' '}
                    <small>DOWNLOAD</small>
                  </CSVLink>
                </Col>
              )}
          </Row>
        </Alert>
      </Container>
    );
  };

  getContributors = contributors => {
    return contributors
      .map(edge => {
        return edge.node.name && edge.node.name.trim() !== ''
          ? edge.node.name
          : edge.node.login;
      })
      .join(',');
  };

  getTopics = edges => {
    return edges.map(edge => {
      return edge.node.topic.name;
    });
  };

  getPrimaryLanguage = primaryLanguage => {
    return primaryLanguage ? primaryLanguage.name : 'na';
  };

  /**
   * Tranform the github data to a csv compiliant format
   */
  handleDownload = data => {
    //  console.log(data);
    return data.edges.map(repo => {
      return {
        name: repo.node.name,
        forkCount: repo.node.forkCount,
        stars: repo.node.stargazers.totalCount,
        contributors: repo.node.collaborators
          ? this.getContributors(repo.node.collaborators.edges)
          : '',
        language: this.getPrimaryLanguage(repo.node.primaryLanguage),
        pushedAt: repo.node.pushedAt,
        createdAt: repo.node.createdAt,
        descriptionHTML: repo.node.descriptionHTML,
        homepageUrl: repo.node.homepageUrl,
        url: repo.node.url,
        topics: this.getTopics(repo.node.repositoryTopics.edges),
        license: repo.node.licenseInfo ? repo.node.licenseInfo.name: 'na'
      };
    });
  };

  render() {
    const csvFileName =
      'ProjectList_' + moment(new Date()).format('DD_MM_YYYY') + '.csv';
    const { data, totalCurrent, totalCount, showSpinner } = this.props;
    const cards = data.organization ? (
      <GitCards
        repositories={data.organization.repositories}
        filters={this.state.filters}
        filterStartDate={this.state.filterStartDate}
        filterEndDate={this.state.filterEndDate}
      />
    ) : (
      <div />
    );
    return (
      <div>
        {this.statusBar(
          totalCount,
          totalCurrent,
          csvFileName,
          data,
          showSpinner,
          true
        )}
        <Container>{cards}</Container>

        {totalCurrent > 0 &&
          this.statusBar(
            totalCount,
            totalCurrent,
            csvFileName,
            data,
            showSpinner,
            false
          )}
      </div>
    );
  }
}

export default RepoList;
