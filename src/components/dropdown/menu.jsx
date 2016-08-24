import React, { Component } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames/bind';
import styles from './dropdown.css';
// import debug from 'debug';

const cx = classNames.bind(styles);

class DropdownMenu extends Component {
  static displayName = 'DropdownMenu';
  props: {
    className: ?string,
    list: Array<{
      title: ?string,
      items: ?Array
    }>,
    menuAlign: 'left'|'right',
    open: ?boolean,
    style: ?Object,
    selected: ?Object,
    showSelected: boolean,
    selectedClassName: ?string,
    linkClassName: ?string,
    itemClassName: ?string,
    itemRenderFn: ?Function,
    itemClickFn: ?Function,
    itemTitleProp: ?string
  };

  static defaultProps: {
    menuAlign: 'left'|'right',
    showSelected: boolean,
    itemTitleProp: ?string
  };

  _renderMenu = (listItem, i) => {
    const { selected, showSelected, selectedClassName,
      linkClassName, itemClassName, itemRenderFn, itemClickFn } = this.props;
    const { items } = listItem;
    const itemText = get(listItem, this.props.itemTitleProp);
    const isSelected = showSelected && isEqual(listItem, selected);
    const clickFn = (e) => {
      e.preventDefault();
      if (isFunction(itemClickFn)) {
        itemClickFn(listItem);
      }
    };
    const subListClass = cx('list', 'list-sub');
    const itemClass = cx('list-item', itemClassName, {
      'link-item': !listItem.items,
      selected: isSelected,
      [selectedClassName]: isSelected
    });
    const textClass = cx('list-item-text');
    const linkClass = cx('list-item-link', linkClassName);

    const renderItem = () => itemRenderFn
      ? itemRenderFn(listItem, itemText, itemClickFn)
      : <a className={ linkClass } href='' onClick={ clickFn }>{ itemText }</a>;

    return (
      <li key={ i } className={ itemClass }>
        { !!items ? <span className={ textClass }>{ itemText }</span> : renderItem() }
        { !!items && <ul className={ subListClass }>{ items.map(this._renderMenu) }</ul> }
      </li>
    );
  }

  render() {
    const { className, style, list, menuAlign, open } = this.props;
    const cxname = cx('list', 'list-main', className, `align-${menuAlign}`, {
      open,
      close: open === false
    });
    return (
      <ul className={ cxname } style={ style }>
        { !!list && list.map(this._renderMenu) }
      </ul>
    );
  }
}

DropdownMenu.defaultProps = {
  menuAlign: 'left',
  showSelected: false,
  itemTitleProp: 'title'
};

export default DropdownMenu;
