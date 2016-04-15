/* globals APP_NAME */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HelmetTitle from './HelmetTitle';

export class App extends Component {
    render() {
        const { user } = this.props;

        return (
            <div className="app container-fluid">
                <HelmetTitle />
                <div className="row">
                    <nav className="navbar navbar-fixed-top navbar-dark bg-primary">
                        <a className="navbar-brand" href="#">{APP_NAME}</a>
                        {user && user.authenticated &&
                            <ul className="nav navbar-nav pull-xs-right">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                        {user.email}
                                    </a>
                                </li>
                            </ul>
                        }
                    </nav>
                </div>
                {this.props.children}
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node,
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps)(App);
