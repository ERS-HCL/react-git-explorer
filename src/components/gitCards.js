import React from 'react';
import {
  Card,
  CardTitle,
  CardText,
  CardColumns,
  CardSubtitle,
  CardBody,
  Badge,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import './gitCards.css';

const GitCards = props => {
  const { repositories } = props;

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
      <Badge color="primary" pill key={edge.node.topic.name}>
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
        <ListGroupItem key={name}>
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

  const repoCards = reposdata.map(data => (
    <Card key={data.name}>
      <CardBody>
        <CardTitle>
          <strong> {data.name} </strong>
        </CardTitle>
        <CardSubtitle>
          <Badge color="dark">{data.language.name}</Badge>
        </CardSubtitle>
        <CardText>
          <span dangerouslySetInnerHTML={{ __html: data.descriptionHTML }} />
        </CardText>
        <CardText>
          {data.topics}
        </CardText>

          <ListGroup>{data.contributors}</ListGroup>
            <a href={data.url} target="_blank"><small>GITHUB</small></a>
      </CardBody>
    </Card>
  ));

  return (
    <CardColumns>{repoCards}</CardColumns>

    /*  <CardColumns>
      <Card>
        <CardBody>
          <CardTitle>
            <strong> {item}</strong>
          </CardTitle>
          <CardSubtitle><Badge color="dark">Java</Badge></CardSubtitle>
          <CardText>Project Description</CardText>
          <CardText>
            <div>
              <Badge color="primary" pill>
                Java
              </Badge>
              <Badge color="primary" pill>
                Microservices
              </Badge>
              <Badge color="primary" pill>
                Success
              </Badge>
              <Badge color="primary" pill>
                Danger
              </Badge>
              <Badge color="primary" pill>
                Warning
              </Badge>
              <Badge color="primary" pill>
                Info
              </Badge>
              <Badge color="primary" pill>
                Light
              </Badge>
              <Badge color="primary" pill>
                Dark
              </Badge>
            </div>
          </CardText>
          <CardText>
            <ListGroup>
              <ListGroupItem>
                <img
                  src="https://loremflickr.com/50/50"
                  alt="Avatar"
                  class="avatar"
                />{' '}
                <small>Contributor One</small>
              </ListGroupItem>
              <ListGroupItem>
                <img
                  src="https://loremflickr.com/50/50"
                  alt="Avatar"
                  class="avatar"
                />{' '}
                <small>Contributor Two</small>
              </ListGroupItem>
            </ListGroup>
          </CardText>
          <Button>GITHUB</Button>
        </CardBody>
      </Card>
    </CardColumns> */
  );
};

export default GitCards;
