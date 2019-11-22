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
    expect(store).to.have.deep.property('filters', [
      'showPassed',
      'showFailed',
      'showPending',
      'showSkipped',
    ]);
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

    describe('toggleFilter', () => {
      [
        ['showPassed', true],
        ['showFailed', true],
        ['showPending', true],
        ['showSkipped', false]
      ].forEach(([filter, initial]) => {
        it(`${filter}`, () => {
          expect(store).to.have.property(filter, initial);
          store.toggleFilter(filter);
          expect(store).to.have.property(filter, !initial);
        });    
      })
    });

    describe('toggleSingleFilter', () => {
      const filters = ['showPassed', 'showFailed', 'showPending', 'showSkipped'];
      describe('when `singleFilter` is NOT set', () => {
        filters.forEach(filter => {
          it(`should set expected filter state when toggling: ${filter}`, () => {
            store.toggleSingleFilter(filter);
            filters.forEach(f => {
              if (f === filter) {
                expect(store[f]).to.equal(true);
              } else {
                expect(store[f]).to.equal(false);
              }
            })
          });
        })
      });

      describe('when `singleFilter` is set', () => {
        beforeEach(() => {
          store.singleFilter = 'showPassed';
        });

        it('should set expected filter state when toggling active filter', () => {
          store.toggleSingleFilter('showPassed');
          filters.forEach(f => {
            expect(store[f]).to.equal(store.initialFilterState[f]);
          });
        });

        it('should set expected filter state when toggling different filter', () => {
          store.toggleSingleFilter('showFailed');
          filters.forEach(f => {
              if (f === 'showFailed') {
                expect(store[f]).to.equal(true);
              } else {
                expect(store[f]).to.equal(false);
              }
          });
        });
      });
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
