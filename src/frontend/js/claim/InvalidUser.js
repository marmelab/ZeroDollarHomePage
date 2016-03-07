import React, { PropTypes } from 'react';

const InvalidUser = ({login}) => (
    <div className="alert alert-danger">
        <p>Sorry {login}, you're not the user who submitted this pull request.</p>
        <p>Please use the link posted as a comment on your pull request.</p>
    </div>
);

InvalidUser.propTypes = {
    login: PropTypes.string.isRequired,
};

export default InvalidUser;
