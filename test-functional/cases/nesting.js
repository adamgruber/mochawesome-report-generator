const { createTest, createBefore } = require('../helpers');

describe('Nesting Suites', () => {
  createTest(1, { forcePass: true, forceRun: true, forceContext: true });

  describe('Child Nested Suite', () => {
    describe('Grandchild Nested Suite', () => {
      createTest(2, { forceRun: true });
    });
  });

  describe('Child Nested Suite', () => {
    createTest(1, { forcePass: true, forceRun: true });
    createTest(1, { forcePend: true });

    describe('Grandchild Nested Suite', () => {
      createTest(2, { forceRun: true });
    });
  });

  describe('Child Nested Suite', () => {
    createBefore(true);
    createTest(2, { forceRun: true });
  });
});
