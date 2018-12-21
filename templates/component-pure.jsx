/**
 * @file component.jsx
 * @desc 
 * @author jinbo
 * @data 
 * @update 
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types';

class component extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: true
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

component.propTypes = {
    optionalString: PropTypes.string,
};

// Specifies the default values for props:
component.defaultProps = {
    optionalString: 'xxx'
};

export default component;