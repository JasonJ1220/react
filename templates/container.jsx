/**
 * @file component.jsx
 * @desc 
 * @author jinbo
 * @data 
 * @update 
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import component from '../components'

const mapStateToProps = (state) => {
  return {
    data: state.data
  }
}

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    onClick: () => {
      dispatch({
        type: 'xxxx',
        data: ownProps
      });
    }
  };

export default connect(  
    mapStateToProps,
    mapDispatchToProps
)(component);