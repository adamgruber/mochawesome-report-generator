import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'utils';
import { nested as testData } from '../fixtures/reports';

describe('ReportStore', () => {
  let store;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('has the correct default state', () => {
    store = createStore();
    expect(store).to.have.deep.property('results', []);
    expect(store).to.have.deep.property('showHooksOptions', [
      'failed',
      'always',
      'never',
      'context',
    ]);
    expect(store).to.include({
      devMode: false,
      enableChart: false,
      initialLoadTimeout: 300,
      isLoading: true,
      showFailed: true,
      showHooks: 'failed',
      showPassed: true,
      showPending: true,
      showSkipped: false,
      sideNavOpen: false,
      VERSION: '__VERSION__',
    });
  });

  it('without config options', () => {
    store = createStore(testData);
    expect(store).to.have.property('reportTitle', undefined);
    expect(store).to.have.property('stats', testData.stats);
    expect(store).to.have.nested.deep.property('results', testData.results);
    expect(store).to.have.deep.property('stats', testData.stats);
    expect(store).to.have.property('enableChart', false);
    expect(store).to.have.property('devMode', false);
    expect(store).to.have.property('showHooks', 'failed');
    expect(store).to.have.property('initialLoadTimeout', 300);
  });

  it('with config options', () => {
    store = createStore(testData, {
      enableCharts: true,
      dev: true,
      showHooks: 'context',
      showPassed: false,
    });
    expect(store).to.have.property('reportTitle', undefined);
    expect(store).to.have.property('stats', testData.stats);
    expect(store).to.have.nested.deep.property('results', testData.results);
    expect(store).to.have.deep.property('stats', testData.stats);
    expect(store).to.have.property('enableChart', true);
    expect(store).to.have.property('devMode', true);
    expect(store).to.have.property('showHooks', 'context');
    expect(store).to.have.property('showPassed', false);
  });

  it('with invalid config options', () => {
    store = createStore(testData, {
      showHooks: 'sometimes',
    });
    expect(store).to.have.property('showHooks', 'failed');
  });

  describe('Actions', () => {
    beforeEach(() => {
      store = createStore(testData, {});
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
      store = createStore(testData, {});
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
