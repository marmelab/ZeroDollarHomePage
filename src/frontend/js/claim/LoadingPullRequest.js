import React, { PropTypes } from 'react';
import Loading from '../app/Loading';

const LoadingPullRequest = ({ pullRequestNumber, repository }) => (
    <div className="jumbotron text-xs-center">
        <p>Claiming pull request #{pullRequestNumber} on <b>{repository}</b></p>
        <Loading size="5x" />
    </div>
);

LoadingPullRequest.propTypes = {
    pullRequestNumber: PropTypes.string,
    repository: PropTypes.string,
};

export default LoadingPullRequest;
