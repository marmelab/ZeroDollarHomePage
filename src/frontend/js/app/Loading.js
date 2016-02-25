import React, { PropTypes } from 'react';
import Icon from 'react-fa';

const Loading = ({size = undefined}) => (
    <Icon name="spinner" spin size={size} />
);

Loading.propTypes = {
    size: PropTypes.string,
};

export default Loading;
