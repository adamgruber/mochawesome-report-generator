import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DropdownMenu from './menu';
import classNames from 'classnames/bind';
import styles from './dropdown.css';

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
    toggleElement: PropTypes.node
  };

  static defaultProps = {
    iconOnly: false
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
    const ddEl = ReactDOM.findDOMNode(this.refs.dropdownComponent);
    if (ddEl && event.target !== ddEl && !ddEl.contains(event.target) && this.state.open) {
      this.setState({ open: false });
    }
  }

  select = (item) => {
    this.closeMenu();
    this.props.onItemSelected(item);
  }

  closeMenu = () => {
    this.setState({ open: false });
  }

  toggleListDisplay = () => {
    this.setState({ open: !this.state.open });
    /* istanbul ignore else */
    if (this.props.onToggle) {
      this.props.onToggle(!this.state.open);
    }
  }

  render() {
    const { list, selected, className, iconOnly, menuAlign,
      menuClassName, menuStyle, toggleClassName, selectedClassName,
      showSelected, linkClassName, itemClassName, itemRenderFn, toggleElement } = this.props;
    const { open } = this.state;

    const displayItem = selected || { title: 'Please select' };
    const arrowClass = cx(
      'toggle-icon', 'fa',
      open ? 'fa-chevron-up' : 'fa-chevron-down',
      { 'icon-only': iconOnly }
    );
    const compClass = cx('component', className);
    const toggleClass = cx('toggle', toggleClassName);
    const toggleFn = () => this.toggleListDisplay();

    return (
      <div ref='dropdownComponent' className={ compClass } >
        <button className={ toggleClass } onClick={ toggleFn } >
          { !!toggleElement && toggleElement }
          { !toggleElement && !iconOnly && displayItem.title }
          { !toggleElement && <i className={ arrowClass } /> }
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
          itemRenderFn={ itemRenderFn }
          itemClickFn={ !!itemRenderFn ? this.closeMenu : this.select } />
      </div>
		);
  }
}

export default Dropdown;
