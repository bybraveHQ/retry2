import {test} from 'node:test';
import assert from 'node:assert';
import * as retry from '../index.js';

test('testForeverUsesFirstTimeout', async () => {
  await new Promise((resolve) => {
    var operation = retry.operation({
      retries: 0,
      minTimeout: 100,
      maxTimeout: 100,
      forever: true
    });

    operation.attempt(function(numAttempt) {
      var err = new Error("foo");
      if (numAttempt == 10) {
        operation.stop();
      }

      if (operation.retry(err)) {
        return;
      }

      assert.strictEqual(numAttempt, 10);
      resolve();
    });
  });
});
