import { expect } from 'chai';
import sinon from 'sinon';
import { ReportStore } from 'js/reportStore';
import testData from 'sample-data/nested.json';

describe('ReportStore', () => {
  let store;
  let clock;

  beforeEach(() => {
    store = new ReportStore();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('has the correct default state', () => {
    expect(store).to.include({
      isLoading: true,
      sideNavOpen: false,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: false,
      showHooks: 'failed',
      VERSION: '__VERSION__'
    });
  });

  describe('setInitialData', () => {
    it('without config options', () => {
      store.setInitialData({
        data: testData,
        config: {}
      });
      expect(store).to.have.property('data', testData);
      expect(store).to.have.property('reportTitle', undefined);
      expect(store).to.have.property('stats', testData.stats);
      expect(store).to.have.deep.property('allSuites[0]', testData.suites);
      expect(store).to.have.deep.property('stats', testData.stats);
      expect(store).to.have.property('enableChart', false);
      expect(store).to.have.property('devMode', false);
      expect(store).to.have.property('showHooks', 'failed');
      expect(store).to.have.property('initialLoadTimeout', 300);
    });

    it('with config options', () => {
      store.setInitialData({
        data: testData,
        config: {
          enableCharts: true,
          dev: true,
          showHooks: 'context'
        }
      });
      expect(store).to.have.property('data', testData);
      expect(store).to.have.property('reportTitle', undefined);
      expect(store).to.have.property('stats', testData.stats);
      expect(store).to.have.deep.property('allSuites[0]', testData.suites);
      expect(store).to.have.deep.property('stats', testData.stats);
      expect(store).to.have.property('enableChart', true);
      expect(store).to.have.property('devMode', true);
      expect(store).to.have.property('showHooks', 'context');
    });


    it('with invalid config options', () => {
      store.setInitialData({
        data: testData,
        config: {
          showHooks: 'sometimes'
        }
      });
      expect(store).to.have.property('showHooks', 'failed');
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      store.setInitialData({ data: testData, config: {} });
    });

    it('openSideNav', () => {
      expect(store).to.have.property('sideNavOpen', false);
      store.openSideNav();
      expect(store).to.have.property('sideNavOpen', true);
    });

    it('closeSideNav', () => {
      store.openSideNav();
      expect(store).to.have.property('sideNavOpen', true);
      store.closeSideNav();
      expect(store).to.have.property('sideNavOpen', false);
    });

    it('toggleFilter, showPassed', () => {
      expect(store).to.have.property('showPassed', true);
      store.toggleFilter('showPassed');
      expect(store).to.have.property('showPassed', false);
    });

    it('toggleFilter, showFailed', () => {
      expect(store).to.have.property('showFailed', true);
      store.toggleFilter('showFailed');
      expect(store).to.have.property('showFailed', false);
    });

    it('toggleFilter, showPending', () => {
      expect(store).to.have.property('showPending', true);
      store.toggleFilter('showPending');
      expect(store).to.have.property('showPending', false);
    });

    it('toggleFilter, showSkipped', () => {
      expect(store).to.have.property('showSkipped', false);
      store.toggleFilter('showSkipped');
      expect(store).to.have.property('showSkipped', true);
    });

    it('setShowHooks', () => {
      expect(store).to.have.property('showHooks', 'failed');
      store.setShowHooks('always');
      expect(store).to.have.property('showHooks', 'always');
    });

    it('setShowHooks (invalid prop)', () => {
      expect(store).to.have.property('showHooks', 'failed');
      store.setShowHooks('sometimes');
      expect(store).to.have.property('showHooks', 'failed');
    });

    it('toggleIsLoading', () => {
      expect(store).to.have.property('isLoading', true);
      store.toggleIsLoading();
      expect(store).to.have.property('isLoading', false);
    });

    it('toggleIsLoading with value', () => {
      expect(store).to.have.property('isLoading', true);
      store.toggleIsLoading(true);
      expect(store).to.have.property('isLoading', true);
    });
  });

  describe('updateFilteredSuites', () => {
    beforeEach(() => {
      store.setInitialData({ data: testData, config: {} });
      store.toggleIsLoading(true);
    });

    describe('when filters are on', () => {
      it('should set isLoading: false and filteredSuites should not be an empty array', () => {
        store.updateFilteredSuites();
        clock.next();
        expect(store.isLoading).to.equal(false);
        expect(store.filteredSuites).to.have.lengthOf(1);
      });
    });

    describe('when filters are off', () => {
      beforeEach(() => {
        store.toggleFilter('showPassed');
        store.toggleFilter('showFailed');
        store.toggleFilter('showPending');
        store.setShowHooks('never');
      });

      it('should set isLoading: false and filteredSuites should be an empty array', () => {
        store.updateFilteredSuites();
        clock.next();
        expect(store.isLoading).to.equal(false);
        expect(store.filteredSuites).to.have.lengthOf(0);
      });
    });
  });
});
