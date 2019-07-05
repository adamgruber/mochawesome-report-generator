/* eslint-disable max-len */
import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import noop from 'lodash/noop';

import { TestContext, CodeSnippet } from 'components/test';

chai.use(chaiEnzyme());

describe('<TestContext />', () => {
  const getInstance = instanceProps => {
    const wrapper = shallow(<TestContext {...instanceProps} />);
    return {
      wrapper,
      ctx: wrapper.find(TestContext),
      ctxItems: wrapper.find('.test-context-item'),
      img: wrapper.find('.test-image'),
      imgLink: wrapper.find('.test-image-link'),
      video: wrapper.find('.test-video'),
      videoLink: wrapper.find('.test-video-link'),
      link: wrapper.find('.test-text-link'),
      snippet: wrapper.find(CodeSnippet),
    };
  };

  describe('when context is a string', () => {
    it('renders simple string', () => {
      const context = 'sample context';
      const { wrapper, snippet } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
    });

    it('renders url with protocol', () => {
      const context = 'http://test.url.com/somepath';
      const { wrapper, snippet, link } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
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
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(link).to.have.lengthOf(1);
    });

    it('renders image url with protocol', () => {
      const context = 'http://test.url.com/testimage.png';
      const { wrapper, snippet, imgLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(imgLink).to.have.lengthOf(1);
      imgLink.simulate('click', { stopPropagation: noop });
    });

    it('renders image url without protocol', () => {
      const context = 'test.url.com/testimage.png';
      const { wrapper, snippet, imgLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(imgLink).to.have.lengthOf(1);
    });

    it('renders local image', () => {
      const context = '/testimage.png';
      const { wrapper, snippet, imgLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(imgLink).to.have.lengthOf(1);
    });

    it('renders base64 jpeg image', () => {
      const context =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAABywAAAgsAAAJpAAACyf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8IAEQgAEAAQAwERAAIRAQMRAf/EAJQAAQEBAAAAAAAAAAAAAAAAAAMFBwEAAwEAAAAAAAAAAAAAAAAAAAEDAhAAAQUBAQAAAAAAAAAAAAAAAgABAwQFESARAAIBAwIHAAAAAAAAAAAAAAERAgAhMRIDQWGRocEiIxIBAAAAAAAAAAAAAAAAAAAAIBMBAAMAAQQDAQAAAAAAAAAAAQARITHwQVGBYXGR4f/aAAwDAQACEQMRAAAB0UlMciEJn//aAAgBAQABBQK5bGtFn6pWi2K12wWTRkjb/9oACAECAAEFAvH/2gAIAQMAAQUCIuIJOqRndRiv/9oACAECAgY/Ah//2gAIAQMCBj8CH//aAAgBAQEGPwLWQzwHepfNbcUNfM4tUIbA9QL4AvnxTlAxacpWJReOlf/aAAgBAQMBPyHZDveuCyu4B4lz2lDKto2ca5uclPK0aoq32x8xgTSLeSgbyzT65n//2gAIAQIDAT8hlQjP/9oACAEDAwE/IaE9GcZFJ//aAAwDAQACEQMRAAAQ5F//2gAIAQEDAT8Q1oowKccI3KTdAWkPLw2ssIrwKYUzuJoUJsIHOCoG23ISlja+rU9QvCx//9oACAECAwE/EAuNIiKf/9oACAEDAwE/ECujJzHf7iwHOv5NhK+8efH50z//2Q==';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders base64 png image', () => {
      const context =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtpJREFUeNqkk29IE3EYx5/bflO33d1uc3bbbaUtJNPK3BqRyrQhRGkJBYmgvgojLPKFEBX1KqIC39dbDQQJRJLQVxKGiANDTJmRkrS1yDnb3f7c/t31u2Vj+aYX/eDD3T2/3/O95/nePYQsy/A/CxGdOoDL2t9PGkKJgE6rO2Q32m6ymwbGsKrd0H5FEbwbxQTwC9cwQi6XA0mSABWS91YZKr1abz8xXLNbLQ803gBrZ4VViYe2t0OLCwu+xbm5WSEancUhvxJX/yWgIi45axpeUAJleXTsnumg2cKsrawgzmZDDEUxtsrKOkdtbf3G+roQj8XCuJKwCnLYAwUJODNlemjQ0qwTnVJbSXNec8nnK+jTWi0YTSZ7T3//AEnTbViAVkEsB5DBAmnpitVmrY4EduCM2YWLIfJJoigWFYj9KSkBkmHsjS0trdiH4yoQJYA4FklJTSWMhkxFkkCCEbbC4Tx+v79wr8Ank3nzGtxudzabrUIgw0vIyi4MiGUpJPFZGHx3C9xWJwyfewaCIECl2VyoIouTg5EIGBiGxQJGBGl5AiTZVXX9qCsOcYDzAIY3pdB++AJcbGsDr9cLvV1dQFFUHpIkwdnUBGebmwELqBBOnoafWfjy/OPjA0MOV/moFu633wVvVSu4xk9CT3c3vBobK1Sg/HbRdBoSPP8DC0QR97kCIClNYyPZ1NPdJ7evPeA8R1rzhw0mUz5ZuRa3IOK25mdmljOZzBayfCr/szdpTJsspy3OOzlJsiKVqiBSvBQDVaIYej0+/h5/hWU1y7KgzANGFHg+9sHnkz0ej4OmaWr/nKixKB+JhIYGB0cDgcAEQRBbRPEBnU4Her3eyXFcZ29fX2N7R0edhePKlUPfQ6Gdt1NTqyMjI/PBYHAyHo8vJRIJIPYNF4VhEUIWjUbjUKvVnNLF3l4Ul/wN972JzdtWNDH8foFSjF6ZqX9McRoTw6R+CTAA9jQ8CY45ChEAAAAASUVORK5CYII=';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders base64 animated gif image', () => {
      const context =
        'data:image/gif;base64,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';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders base64 x-icon image', () => {
      const context =
        'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAALCvr/zM96vMwOOnzLzXl8y804/MnLd7zBw3Z8wQN1/MeI9XzJSbU8yIiz/MgHszzHhvL8xYRtP8AAAAAPDnu/22X9v9NcvX/TXD1/0lr9P9FZvb/LEz0/4ia+f+Wpvr/ES/x/zFH+f8wPvj/Ljf4/yww+f8tKv//ExCy/zs57/poi/X/RF/y/0Vh8v9EXvH/KUXv/2R38////////////11r8f8ZKu3/Ljrt/ysw7P8nKez/Kif+/xQPtP8SAuluY3Xz/09x8/9FYvL/RGDx/y9L7/9XbvL/+fv+//v6//9OYPD/HzDu/y457v8rMe3/Ky35/yIe3f8LBpB4AAAAACkf6ulnivX/PVzy/0Rg8f9CW/H/JULv/z9S7/8/UvD/DSfs/zE/7/8uOO7/KzHt/ywt+/8RDanxAAAAAAAAAAAVBedTTFTu/09z9f9AW/H/MEzv/1Vq8v///////////0le8P8dL+7/Ljnt/y82/P8fHND/DgmcUgAAAAAAAAAAAAAAAEo+6MVqgfX/OVjy/yA97v9fdPP///////////9aa/H/Fyrt/zE99P8sMPD/EQukwQAAAAAAAAAAAAAAAAAAAABSR+chfX3x/3yW9/8/WPH/Y3f0////////////UWHx/xAj7f8rOvn/FxTF/wwBoiEAAAAAAAAAAAAAAAAAAAAAAAAAAE9D5Z+LmfT/aID1/4mX9v///////////3GA8/9BUfX/WF/v/0M7uJ8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRSOcMaGTp/3KK+f+Dk/b///////////+Gkvb/XGv5/1lW0f9XUcUMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEg84FJzevD/hpz6////////////f4/7/1BX5v9NQ8FSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRSOAHWVHg1oCU9/+Lmfb/kZ32/15y+P9QSszWUUjJBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9E3TJvcej/b4r6/1t0/P9cX+L/UEfLMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATkbahXh96/9udOr/UEbPhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQSdhqUkvUeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAMADAADgBwAA4AcAAPAPAADwDwAA+B8AAPw/AAD+fwAA//8AAA==';
      const { wrapper, snippet, img } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(img).to.have.lengthOf(1);
    });

    it('renders local video', () => {
      const context = '/testvideo.mp4';
      const { wrapper, snippet, video } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('video');
      expect(video).to.have.attr('src', '/testvideo.mp4');
    });

    it('renders video url with protocol', () => {
      const context = 'http://test.url.com/testvideo.mp4';
      const { wrapper, snippet, videoLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('video');
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('a.test-video-link');
      expect(videoLink).to.have.attr(
        'href',
        'http://test.url.com/testvideo.mp4'
      );
    });

    it('renders video url with protocol and mediafragment', () => {
      const context = 'http://test.url.com/testvideo.mp4#t=123';
      const { wrapper, snippet, videoLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('video');
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('a.test-video-link');
      expect(videoLink).to.have.attr(
        'href',
        'http://test.url.com/testvideo.mp4#t=123'
      );
    });

    it('renders image url without protocol', () => {
      const context = 'test.url.com/testvideo.mp4';
      const { wrapper, snippet, videoLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('video');
      expect(wrapper)
        .to.have.exactly(1)
        .descendants('a.test-video-link');
      expect(videoLink).to.have.attr(
        'href',
        'http://test.url.com/testvideo.mp4'
      );
    });
  });

  describe('when context is an object', () => {
    it('renders undefined value', () => {
      const context = {
        title: 'sample context',
        value: 'undefined',
      };
      const { wrapper, ctxItems } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(ctxItems).to.have.lengthOf(1);
    });

    it('renders string value', () => {
      const context = {
        title: 'sample context',
        value: 'context string',
      };
      const { wrapper, snippet } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
      expect(snippet.prop('highlight')).to.equal(false);
    });

    it('renders image url value', () => {
      const context = {
        title: 'sample context',
        value: 'http://test.url.com/testimage.png',
      };
      const { wrapper, snippet, imgLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(0);
      expect(imgLink).to.have.lengthOf(1);
    });

    it('renders object value', () => {
      const context = {
        title: 'sample context',
        value: { testing: true },
      };
      const { wrapper, snippet } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
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
          value: 'http://test.url.com/testimage.png',
        },
        {
          title: 'sample context b',
          value: { testing: true },
        },
      ];
      const { wrapper, snippet, imgLink } = getInstance({
        context: JSON.stringify(context),
        className: 'test',
      });
      expect(wrapper).to.have.className('test');
      expect(snippet).to.have.lengthOf(1);
      expect(imgLink).to.have.lengthOf(1);
    });
  });
});
