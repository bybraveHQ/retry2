import {test} from 'node:test';
import assert from 'node:assert';
import * as retry from '../index.js';

function getLib() {
  return {
    fn1: function() {},
    fn2: function() {},
    fn3: function() {}
  };
}

test('wrapAll', () => {
  var lib = getLib();
  retry.wrap(lib);
  assert.strictEqual(lib.fn1.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn2.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn3.name, 'bound retryWrapper');
});

test('wrapAllPassOptions', () => {
  var lib = getLib();
  retry.wrap(lib, {retries: 2});
  assert.strictEqual(lib.fn1.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn2.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn3.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn1.options.retries, 2);
  assert.strictEqual(lib.fn2.options.retries, 2);
  assert.strictEqual(lib.fn3.options.retries, 2);
});

test('wrapDefined', () => {
  var lib = getLib();
  retry.wrap(lib, ['fn2', 'fn3']);
  assert.notStrictEqual(lib.fn1.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn2.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn3.name, 'bound retryWrapper');
});

test('wrapDefinedAndPassOptions', () => {
  var lib = getLib();
  retry.wrap(lib, {retries: 2}, ['fn2', 'fn3']);
  assert.notStrictEqual(lib.fn1.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn2.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn3.name, 'bound retryWrapper');
  assert.strictEqual(lib.fn2.options.retries, 2);
  assert.strictEqual(lib.fn3.options.retries, 2);
});

test('runWrappedWithoutError', () => {
  var callbackCalled;
  var lib = {method: function(a, b, callback) {
    assert.strictEqual(a, 1);
    assert.strictEqual(b, 2);
    assert.strictEqual(typeof callback, 'function');
    callback();
  }};
  retry.wrap(lib);
  lib.method(1, 2, function() {
    callbackCalled = true;
  });
  assert.ok(callbackCalled);
});

test('runWrappedSeveralWithoutError', () => {
  var callbacksCalled = 0;
  var lib = {
    fn1: function (a, callback) {
      assert.strictEqual(a, 1);
      assert.strictEqual(typeof callback, 'function');
      callback();
    },
    fn2: function (a, callback) {
      assert.strictEqual(a, 2);
      assert.strictEqual(typeof callback, 'function');
      callback();
    }
  };
  retry.wrap(lib, {}, ['fn1', 'fn2']);
  lib.fn1(1, function() {
    callbacksCalled++;
  });
  lib.fn2(2, function() {
    callbacksCalled++;
  });
  assert.strictEqual(callbacksCalled, 2);
});

test('runWrappedWithError', () => {
  var callbackCalled;
  var lib = {method: function(callback) {
    callback(new Error('Some error'));
  }};
  retry.wrap(lib, {retries: 1});
  lib.method(function(err) {
    callbackCalled = true;
    assert.ok(err instanceof Error);
  });
  assert.ok(!callbackCalled);
});
