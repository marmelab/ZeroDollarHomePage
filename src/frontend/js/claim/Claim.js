import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HelmetTitle from '../app/HelmetTitle';
import claimActions from './claimActions';
import moment from 'moment';
import InvalidPullRequest from './InvalidPullRequest';
import LoadingPullRequest from './LoadingPullRequest';

class Claim extends Component {
    componentDidMount() {
        this.props.loadPullRequest(this.props.repository, this.props.pullRequestNumber);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.repository !== nextProps.repository || this.props.pullRequestNumber !== nextProps.pullRequestNumber) {
            this.props.loadPullRequest(this.props.repository, this.props.pullRequestNumber);
        }
    }

    render() {
        const { error, loading, pullRequest, pullRequestNumber, repository } = this.props;

        return (
            <div className="container claim-page">
                <HelmetTitle title="Claim your pull request" />
                {(error || !repository || !pullRequestNumber) && <InvalidPullRequest />}

                {loading && repository && pullRequestNumber && <LoadingPullRequest {...{ pullRequestNumber, repository }} />}

                {!loading && pullRequest &&
                    <div className="jumbotron">
                        <h2>Hi {pullRequest.user.login}!</h2>
                        <p>You submited this pull request (<a href={pullRequest.html_url} target="_blank">{pullRequest.title}</a>) on {moment(pullRequest.created_at).format('LL')}.</p>
                        <p>Please send us an image you'd like to see on the <b>ZeroDollarHomePage</b> !</p>
                    </div>
                }
            </div>
        );
    }
}

Claim.propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    loadPullRequest: PropTypes.func.isRequired,
    pullRequest: PropTypes.object,
    pullRequestNumber: PropTypes.string,
    repository: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        error: state.claim.error,
        loading: state.claim.loading,
        pullRequest: state.claim.item,
        pullRequestNumber: state.routing.location.query && state.routing.location.query.pr,
        repository: state.routing.location.query && state.routing.location.query.repository,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadPullRequest: claimActions.item.request }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Claim);
