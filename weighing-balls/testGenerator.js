/* @flow */

import OptimalStrategy from './OptimalStrategy';

import chalk from 'chalk';
import invariant from 'invariant';

import type Strategy from './Strategy';

export type Generator = () => Strategy;

export default function testGenerator(generator: Generator): void {
  console.log(chalk.green('Testing generator'));

  const BALLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const optimalStrategy = new OptimalStrategy();
  const strategyToTest = generator();

  let optimalMaxChecks = 0;
  let testMaxChecks = 0;

  for (let i = 0; i < 24; ++i) {
    console.log(chalk.green(`--- RUNNING OPTIMAL STRATEGY ${i + 1} ---`));
    const outlierBall = BALLS[Math.floor(i / 2)];
    const outlierWeightType = i % 2 === 0 ? 'HEAVY' : 'LIGHT';

    optimalStrategy.initialize(
      BALLS,
      outlierBall,
      outlierWeightType,
      'LOGGING',
    );
    optimalStrategy.runStrategy(BALLS);
    invariant(
      optimalStrategy.strategyStatus === 'RUN_COMPLETE',
      '[INTERNAL ERROR]: Expecting optimal strategy to have completed.',
    );

    optimalMaxChecks = Math.max(
      optimalMaxChecks,
      optimalStrategy.scaleRuns.length,
    );

    console.log('\n');
    console.log(chalk.green(`--- RUNNING TEST STRATEGY ${i + 1} ---`));

    strategyToTest.initialize(BALLS, outlierBall, outlierWeightType, 'LOGGING');
    strategyToTest.runStrategy(BALLS);
    invariant(
      strategyToTest.strategyStatus === 'RUN_COMPLETE',
      'Expecting strategy to have completed. Please check your implementation of "runStrategy"',
    );

    testMaxChecks = Math.max(testMaxChecks, strategyToTest.scaleRuns.length);

    console.log('\n');
  }

  for (let i = 0; i < 24; ++i) {}

  if (testMaxChecks === optimalMaxChecks) {
    console.log(chalk.green('Your generator is optimal!'));
  } else if (testMaxChecks > optimalMaxChecks) {
    console.log(
      chalk.red(
        `Your generator created a non-optimal strategy:\nOptimal: ${optimalMaxChecks}\nActual Max Checks: ${testMaxChecks}`,
      ),
    );
  } else {
    console.log(
      chalk.red(
        `Your a cheater! Your strategy was more optimal than the optimal strategy.`,
      ),
    );
  }
}
