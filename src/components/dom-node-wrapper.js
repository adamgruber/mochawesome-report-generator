import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DomNodeWrapper extends Component {
  static propTypes = {
    children: React.PropTypes.node
  };

  getMeasurements(measurements) {
    const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();

    if (typeof measurements === 'string') {
      return rect[measurements];
    }

    if (Array.isArray(measurements)) {
      const retObj = {};
      measurements.forEach(measurement => {
        retObj[measurement] = rect[measurement];
      });
      return retObj;
    }

    return rect;
  }

  render() {
    return this.props.children;
  }
}

export default DomNodeWrapper;
