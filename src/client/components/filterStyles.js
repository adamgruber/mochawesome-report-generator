import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilterStyles extends Component {
  static propTypes = {
    filtered: PropTypes.array,
  };

  componentDidMount() {
    console.log(this.node);
  }

  render() {
    return (
      <style
        ref={c => {
          this.node = c;
        }}>
        {this.props.filtered.forEach(filter => `#${filter}:{display:none;}`)}
      </style>
    );
  }
}

export default FilterStyles;
