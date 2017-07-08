import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import noop from 'lodash/noop';

import { TestContext, CodeSnippet } from 'components/test';

chai.use(chaiEnzyme());

describe('<TestContext />', () => {
  const getInstance = instanceProps => {
    const wrapper = shallow(<TestContext { ...instanceProps } />);
    return {
      wrapper,
      ctx: wrapper.find(TestContext),
      ctxItems: wrapper.find('.test-context-item'),
      img: wrapper.find('.test-image'),
      link: wrapper.find('.test-text-link'),
      snippet: wrapper.find(CodeSnippet)
    };
  };

  describe('when context is a string', () => {
    it('renders simple string', () => {
      const context = 'sample context';
      const { wrapper, snippet } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
    });

    it('renders url with protocol', () => {
      const context = 'http://test.url.com/somepath';
      const { wrapper, snippet, link } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(link).to.have.lengthOf(1);
      link.simulate('click', { stopPropagation: noop });
    });

    it('renders url without protocol', () => {
      const context = 'test.url.com/somepath';
      const { wrapper, snippet, link } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(link).to.have.lengthOf(1);
    });

    it('renders image url with protocol', () => {
      const context = 'http://test.url.com/testimage.png';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
      img.simulate('click', { stopPropagation: noop });
    });

    it('renders image url without protocol', () => {
      const context = 'test.url.com/testimage.png';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders local image', () => {
      const context = '/testimage.png';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders base64 image', () => {
      const context = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAABywAAAgsAAAJpAAACyf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8IAEQgAEAAQAwERAAIRAQMRAf/EAJQAAQEBAAAAAAAAAAAAAAAAAAMFBwEAAwEAAAAAAAAAAAAAAAAAAAEDAhAAAQUBAQAAAAAAAAAAAAAAAgABAwQFESARAAIBAwIHAAAAAAAAAAAAAAERAgAhMRIDQWGRocEiIxIBAAAAAAAAAAAAAAAAAAAAIBMBAAMAAQQDAQAAAAAAAAAAAQARITHwQVGBYXGR4f/aAAwDAQACEQMRAAAB0UlMciEJn//aAAgBAQABBQK5bGtFn6pWi2K12wWTRkjb/9oACAECAAEFAvH/2gAIAQMAAQUCIuIJOqRndRiv/9oACAECAgY/Ah//2gAIAQMCBj8CH//aAAgBAQEGPwLWQzwHepfNbcUNfM4tUIbA9QL4AvnxTlAxacpWJReOlf/aAAgBAQMBPyHZDveuCyu4B4lz2lDKto2ca5uclPK0aoq32x8xgTSLeSgbyzT65n//2gAIAQIDAT8hlQjP/9oACAEDAwE/IaE9GcZFJ//aAAwDAQACEQMRAAAQ5F//2gAIAQEDAT8Q1oowKccI3KTdAWkPLw2ssIrwKYUzuJoUJsIHOCoG23ISlja+rU9QvCx//9oACAECAwE/EAuNIiKf/9oACAEDAwE/ECujJzHf7iwHOv5NhK+8efH50z//2Q==';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });
  });

  describe('when context is an object', () => {
    it('renders undefined value', () => {
      const context = {
        title: 'sample context',
        value: 'undefined'
      };
      const { wrapper, ctxItems } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(ctxItems).to.have.lengthOf(1);
    });


    it('renders string value', () => {
      const context = {
        title: 'sample context',
        value: 'context string'
      };
      const { wrapper, snippet } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
      expect(snippet.prop('highlight')).to.equal(false);
    });

    it('renders image url value', () => {
      const context = {
        title: 'sample context',
        value: 'http://test.url.com/testimage.png'
      };
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders object value', () => {
      const context = {
        title: 'sample context',
        value: { testing: true }
      };
      const { wrapper, snippet } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
      expect(snippet.prop('highlight')).to.equal(true);
    });
  });

  describe('when context is an array', () => {
    it('renders', () => {
      const context = [
        {
          title: 'sample context a',
          value: 'http://test.url.com/testimage.png'
        },
        {
          title: 'sample context b',
          value: { testing: true }
        }
      ];
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test'
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
      expect(img).to.have.lengthOf(1);
    });
  });
});
