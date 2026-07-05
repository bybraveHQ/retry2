import {test} from 'node:test';
import assert from 'node:assert';
import * as retry from '../index.js';

test('testDefaultValues', () => {
  var timeouts = retry.timeouts();

  assert.strictEqual(timeouts.length, 10);
  assert.strictEqual(timeouts[0], 1000);
  assert.strictEqual(timeouts[1], 2000);
  assert.strictEqual(timeouts[2], 4000);
});

test('testDefaultValuesWithRandomize', () => {
  var minTimeout = 5000;
  var timeouts = retry.timeouts({
    minTimeout: minTimeout,
    randomize: true
  });

  assert.strictEqual(timeouts.length, 10);
  assert.ok(timeouts[0] > minTimeout);
  assert.ok(timeouts[1] > timeouts[0]);
  assert.ok(timeouts[2] > timeouts[1]);
});

test('testPassedTimeoutsAreUsed', () => {
  var timeoutsArray = [1000, 2000, 3000];
  var timeouts = retry.timeouts(timeoutsArray);
  assert.deepStrictEqual(timeouts, timeoutsArray);
  assert.notStrictEqual(timeouts, timeoutsArray);
});

test('testTimeoutsAreWithinBoundaries', () => {
  var minTimeout = 1000;
  var maxTimeout = 10000;
  var timeouts = retry.timeouts({
    minTimeout: minTimeout,
    maxTimeout: maxTimeout
  });
  for (var i = 0; i < timeouts; i++) {
    assert.ok(timeouts[i] >= minTimeout);
    assert.ok(timeouts[i] <= maxTimeout);
  }
});

test('testTimeoutsAreIncremental', () => {
  var timeouts = retry.timeouts();
  var lastTimeout = timeouts[0];
  for (var i = 0; i < timeouts; i++) {
    assert.ok(timeouts[i] > lastTimeout);
    lastTimeout = timeouts[i];
  }
});

test('testTimeoutsAreIncrementalForFactorsLessThanOne', () => {
  var timeouts = retry.timeouts({
    retries: 3,
    factor: 0.5
  });

  var expected = [250, 500, 1000];
  assert.deepStrictEqual(expected, timeouts);
});

test('testRetries', () => {
  var timeouts = retry.timeouts({retries: 2});
  assert.strictEqual(timeouts.length, 2);
});
