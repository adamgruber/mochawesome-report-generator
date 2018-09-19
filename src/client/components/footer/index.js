/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './footer.css';

const cx = classNames.bind(styles);

const urls = {
  site: 'http://adamgruber.github.io/mochawesome/',
  github: 'https://github.com/adamgruber',
};

const Footer = ({ version }) => {
  const copyrightYear = new Date().getFullYear();
  return (
    <footer className={cx('component')}>
      <div className="container">
        <p>
          &copy;
          {copyrightYear}
          &nbsp;
          <a href={urls.site} target="_blank" rel="noopener noreferrer">
            Mochawesome
          </a>
          &nbsp;was designed and built by&nbsp;
          <a href={urls.github} target="_blank" rel="noopener noreferrer">
            Adam Gruber
          </a>{' '}
          • <span>v{version}</span>
        </p>
        {}
      </div>
    </footer>
  );
};

Footer.propTypes = {
  version: PropTypes.string,
};

export default Footer;
