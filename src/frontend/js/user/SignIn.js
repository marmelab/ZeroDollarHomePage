import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-fa';
import HelmetTitle from '../app/HelmetTitle';
import { signIn as signInActions } from './userActions';

const SignIn = ({ signInError, signIn, previousRoute }) => (
    <div className="container signIn">
        <HelmetTitle title="Sign in" />
        <div className="row">
            <div className="col-xs-12">
                <div className="jumbotron">
                    <h2 className="display-4">Sign in</h2>
                    {signInError &&
                        <div className="alert alert-danger" role="alert">
                            {signInError.message}
                        </div>
                    }
                    <button className="btn btn-lg btn-primary" onClick={() => signIn(previousRoute)}>
                        <Icon name="github" />&nbsp;
                        Sign in with Github
                    </button>
                </div>
            </div>
        </div>
    </div>
);

SignIn.propTypes = {
    signIn: PropTypes.func.isRequired,
    previousRoute: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        previousRoute: state.routing.location.state && state.routing.location.state.nextPath,
        signInError: state.user.error,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        signIn: signInActions.request,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
