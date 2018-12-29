/**
 * @file container.jsx
 * @desc 
 * @author jinbo
 * @data 
 * @update 
 */
import React from 'react';
import { connect } from 'dva';
import styles from './Container.less';

const mapStateToProps = (state) => ({
  data: state.data
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch({
      type: 'xxxx',
      data: ownProps
    });
  }
})

class Container extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
  render() {
    return (
      <React.Fragment>
        <div className={styles.normal}>
          test Page!
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container)