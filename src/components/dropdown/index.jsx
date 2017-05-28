import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classNames from 'classnames/bind';
import styles from './dropdown.css';
import DropdownMenu from './menu';

const cx = classNames.bind(styles);

class Dropdown extends Component {
  static displayName = 'Dropdown';
  static propTypes = {
    className: PropTypes.any,
    iconOnly: PropTypes.bool,
    itemClassName: PropTypes.string,
    list: PropTypes.array,
    linkClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    menuAlign: PropTypes.oneOf([ 'left', 'right' ]),
    menuStyle: PropTypes.object,
    selected: PropTypes.object,
    selectedClassName: PropTypes.string,
    showSelected: PropTypes.bool,
    toggleClassName: PropTypes.string,
    onItemSelected: PropTypes.func,
    onToggle: PropTypes.func,
    itemRenderFn: PropTypes.func,
    toggleIcon: PropTypes.element,
    itemTitleProp: PropTypes.string
  };

  static defaultProps = {
    iconOnly: false,
    itemTitleProp: 'title'
  };

  state = {
    open: null
  };

  componentDidMount() {
    document.addEventListener('click', this.documentClickHandler.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClickHandler.bind(this));
  }

  documentClickHandler(event) {
    const ddEl = this.node;
    if (ddEl && event.target !== ddEl && !ddEl.contains(event.target) && this.state.open) {
      this.closeMenu();
    }
  }

  select = item => {
    this.closeMenu();
    this.props.onItemSelected(item);
  }

  closeMenu = () => {
    this.setState({ open: false });
    /* istanbul ignore else */
    if (this.props.onToggle) {
      this.props.onToggle(false);
    }
  }

  toggleListDisplay = () => {
    this.setState({ open: !this.state.open });
    /* istanbul ignore else */
    if (this.props.onToggle) {
      this.props.onToggle(!this.state.open);
    }
  }

  _getItemText = item => get(item, this.props.itemTitleProp);

  render() {
    const { list, selected, className, iconOnly, menuAlign,
      menuClassName, menuStyle, toggleClassName, selectedClassName,
      showSelected, linkClassName, itemClassName, itemTitleProp,
      itemRenderFn, toggleIcon } = this.props;
    const { open } = this.state;

    const displayItem = selected || { title: 'Please select' };
    const compClass = cx('component', className);
    const toggleClass = cx('toggle', toggleClassName);
    const toggleFn = () => this.toggleListDisplay();

    return (
      <div ref={ node => (this.node = node) } className={ compClass } >
        <button className={ toggleClass } onClick={ toggleFn } >
          { !iconOnly && this._getItemText(displayItem) }
          { !!toggleIcon && toggleIcon() }
        </button>
        <DropdownMenu
          className={ menuClassName }
          menuAlign={ menuAlign }
          open={ open }
          style={ menuStyle }
          list={ list }
          selected={ selected }
          showSelected={ showSelected }
          selectedClassName={ selectedClassName }
          linkClassName={ linkClassName }
          itemClassName={ itemClassName }
          itemTitleProp={ itemTitleProp }
          itemRenderFn={ itemRenderFn }
          itemClickFn={ itemRenderFn ? this.closeMenu : this.select } />
      </div>
    );
  }
}

export default Dropdown;
