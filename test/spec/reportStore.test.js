import { expect } from 'chai';
import { ReportStore } from 'js/reportStore';
import testData from 'sample-data/nested.json';

describe('ReportStore', () => {
  let store;

  beforeEach(() => {
    store = new ReportStore();
  });

  it('has the correct default state', () => {
    expect(store).to.include({
      sideNavOpen: false,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: false,
      quickSummaryWidth: null,
      windowWidth: null,
      showHooks: 'failed'
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

  describe('Computed Properties', () => {
    beforeEach(() => {
      store.setInitialData({ data: testData, config: {} });
    });

    describe('mobileBreakpoint', () => {
      it('returns false when windowWidth >= 768', () => {
        store.setWindowWidth(1024);
        expect(store.mobileBreakpoint).to.equal(false);
      });

      it('returns true when windowWidth < 768', () => {
        store.setWindowWidth(600);
        expect(store.mobileBreakpoint).to.equal(true);
      });
    });

    describe('suites', () => {
      it('is not empty when filters are on', () => {
        store.toggleFilter('showSkipped');
        expect(store.suites).to.have.lengthOf(1);
        store.toggleFilter('showSkipped');
      });

      it('is empty when fiilters are off', () => {
        store.toggleFilter('showPassed');
        store.toggleFilter('showFailed');
        store.toggleFilter('showPending');
        store.setShowHooks('never');
        expect(store.suites).to.have.lengthOf(0);
      });
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

    it('setQuickSummaryWidth', () => {
      expect(store).to.have.property('quickSummaryWidth', null);
      store.setQuickSummaryWidth(400);
      expect(store).to.have.property('quickSummaryWidth', 400);
    });

    it('setWindowWidth', () => {
      expect(store).to.have.property('windowWidth', null);
      store.setWindowWidth(400);
      expect(store).to.have.property('windowWidth', 400);
    });
  });
});
