import React from 'react';
import {
  Fade,
  Badge,
  Card,
  CardBody,
  CardColumns,
  CardSubtitle,
  CardText,
  CardTitle,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import GitDecorators from '../gitDecorators/gitDecorators';
import './gitCards.css';
const moment = require('moment-timezone');
moment.tz.setDefault('UTC');
/**
 * Git Cards Component displays github repository data in a cards view
 */
const GitCards = props => {
  const { repositories, filters, filterStartDate, filterEndDate } = props;

  // Extract primary language details
  const getPrimaryLanguage = primaryLanguage => {
    return primaryLanguage
      ? {
          name: primaryLanguage.name,
          color: primaryLanguage.color
        }
      : {
          name: 'na',
          color: 'black'
        };
  };

  const getTopics = edges => {
    return edges.map(edge => (
      <Badge color="primary" pill key={edge.node.topic.name} className="pills">
        {edge.node.topic.name}
      </Badge>
    ));
  };

  const getContributors = contributors => {
    return contributors.map(edge => {
      const name =
        edge.node.name && edge.node.name.trim() !== ''
          ? edge.node.name
          : edge.node.login;
      return (
        <ListGroupItem key={name} className="my-contributors">
          <img src={edge.node.avatarUrl} alt="Avatar" className="avatar" />{' '}
          <small>{name}</small>
        </ListGroupItem>
      );
    });
  };

  const reposdata = repositories.edges.map(repo => {
    return {
      name: repo.node.name,
      forkCount: repo.node.forkCount,
      stars: repo.node.stargazers.totalCount,
      contributors: getContributors(repo.node.collaborators.edges),
      language: getPrimaryLanguage(repo.node.primaryLanguage),
      pushedAt: repo.node.pushedAt,
      createdAt: repo.node.createdAt,
      descriptionHTML: repo.node.descriptionHTML,
      homepageUrl: repo.node.homepageUrl,
      url: repo.node.url,
      topics: getTopics(repo.node.repositoryTopics.edges),
      license: repo.node.license
    };
  });

  const filterRepos = reposdata.filter(
    data =>
      // Check if the filter set is equal to the data being checked
      filters.length > 0
        ? filters.filter(
            filter =>
              filter.value.toUpperCase() === data.language.name.toUpperCase()
          ).length > 0
        : true
  );

  const filterDateRange = filterRepos.filter(
    data =>
      (filterStartDate
        ? moment(data.pushedAt).isAfter(filterStartDate)
        : true) &&
      (filterEndDate ? moment(data.pushedAt).isBefore(filterEndDate) : true)
  );
  // console.log(filterDateRange);
  const repoCards = filterDateRange.map(data => (
    <Fade in={true} key={data.name}>
      <Card className="my-card">
        <CardBody>
          <CardTitle>{data.name}</CardTitle>
          <CardSubtitle>
            <GitDecorators
              stars={data.stars}
              forks={data.forkCount}
              license={data.license}
              created={data.createdAt}
              pushed={data.pushedAt}
            />
            <Badge color="dark" className="my-badge">
              {data.language.name}
            </Badge>
          </CardSubtitle>
          <CardText>
            <span dangerouslySetInnerHTML={{ __html: data.descriptionHTML }} />
          </CardText>
          <CardText>{data.topics}</CardText>
          <ListGroup>{data.contributors}</ListGroup>
          <a href={data.url} target="_blank" className="my-anchor">
            <small>GITHUB</small>
          </a>
        </CardBody>
      </Card>
    </Fade>
  ));

  return <CardColumns>{repoCards}</CardColumns>;
};

export default GitCards;
