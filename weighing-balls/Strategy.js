/* @flow */

import chalk from 'chalk';
import invariant from 'invariant';

export type BallID = string;
export type LogType = 'NO_LOGGING' | 'LOGGING';
export type OutlierWeightType = 'HEAVY' | 'LIGHT';
export type ScaleRun = { leftSide: Array<BallID>, rightSide: Array<BallID> };
export type ScaleRunResult = 'BALANCED' | 'TIP_TO_LEFT' | 'TIP_TO_RIGHT';
export type StrategyStatus =
  | 'NOT_INITIALIZED'
  | 'RUNNING_STRATEGY'
  | 'RUN_COMPLETE';

export const NUMBER_OF_BALLS = 12;

export default class Strategy {
  _balls: Array<BallID>;
  _logType: LogType;
  _outlierBall: BallID;
  _outlierWeightType: OutlierWeightType;
  _scaleRuns: Array<ScaleRun>;
  _strategyStatus: StrategyStatus;

  // OVERRIDE ME!
  // NOTE: If you are reading or modifying any instance variables on this class,
  // you are cheating. You can use the parameters passed into this function
  // and you can use the methods __useScale and __submitOutlierBall. Note that
  // once you submit the outlier ball, the run should be over. If you guess
  // wrong, you have failed.
  runStrategy(balls: Array<BallID>): void {
    invariant(false, 'Subclasses of Strategy must override "runStrategy"');
  }

  // DO NOT OVERRIDE
  __useScale(
    rightSide: Array<BallID>,
    leftSide: Array<BallID>,
  ): ScaleRunResult {
    invariant(
      this._strategyStatus === 'RUNNING_STRATEGY',
      'Cannot call "useScale" unless you are running the strategy',
    );
    invariant(
      rightSide.every(rhs => this._balls.includes(rhs)),
      'There is something on the right side that is not a valid ball',
    );
    invariant(
      leftSide.every(lhs => this._balls.includes(lhs)),
      'There is something on the left side that is not a valid ball',
    );
    invariant(
      rightSide.every(rhs => !leftSide.includes(rhs)),
      'Cannot have the same ball on the left and right side of the scale',
    );

    this._scaleRuns.push({ leftSide, rightSide });

    const leftString = `[${leftSide.join(', ')}]`;
    const rightString = `[${rightSide.join(', ')}]`;

    if (rightSide.length !== rightSide.length) {
      // The weight of the outlier is slightly different than the other balls,
      // so if there are more balls on one side than the other, the side with
      // more balls will always be heavier.
      if (this._logType === 'LOGGING') {
        rightSide.length > leftSide.length
          ? console.log(chalk.green(`${leftString} < ${rightString}`))
          : console.log(chalk.green(`${leftString} > ${rightString}`));
      }
      return rightSide.length > leftSide.length
        ? 'TIP_TO_RIGHT'
        : 'TIP_TO_LEFT';
    }

    if (rightSide.includes(this._outlierBall)) {
      if (this._logType === 'LOGGING') {
        this._outlierWeightType === 'HEAVY'
          ? console.log(chalk.green(`${leftString} < ${rightString}`))
          : console.log(chalk.green(`${leftString} > ${rightString}`));
      }
      return this._outlierWeightType === 'HEAVY'
        ? 'TIP_TO_RIGHT'
        : 'TIP_TO_LEFT';
    } else if (leftSide.includes(this._outlierBall)) {
      if (this._logType === 'LOGGING') {
        this._outlierWeightType === 'HEAVY'
          ? console.log(chalk.green(`${leftString} > ${rightString}`))
          : console.log(chalk.green(`${leftString} < ${rightString}`));
      }
      return this._outlierWeightType === 'HEAVY'
        ? 'TIP_TO_LEFT'
        : 'TIP_TO_RIGHT';
    }

    this._logType &&
      console.log(chalk.green(`${leftString} == ${rightString}`));

    return 'BALANCED';
  }

  // DO NOT OVERRIDE.
  // NOTE: If you submit the wrong ball, the attempt fails and you have failed
  // the task. You can no longer invoke __useScale or __submitOutlierBall until
  // you re-initialize the Strategy with a new set of balls.
  __submitOutlierBall(ball: BallID): void {
    this._logType === 'LOGGING' &&
      console.log(chalk.green('Submitting ball:', ball));
    this._strategyStatus = 'RUN_COMPLETE';
  }

  // DO NOT OVERRIDE
  get scaleRuns(): Array<ScaleRun> {
    return this._scaleRuns;
  }

  get strategyStatus(): StrategyStatus {
    return this._strategyStatus;
  }

  // DO NOT OVERRIDE.
  initialize(
    balls: Array<BallID>,
    outlierBall: BallID,
    outlierWeightType: OutlierWeightType,
    logType: 'NO_LOGGING' | 'LOGGING' = 'NO_LOGGING',
  ): void {
    invariant(
      balls.length === NUMBER_OF_BALLS,
      'Expecting the number of balls to be %s',
      NUMBER_OF_BALLS,
    );
    invariant(
      balls.every((ball, index) =>
        balls.slice(index + 1).every(_ball => ball !== _ball),
      ),
      'You cannot have 2 identical ball identifiers',
    );
    invariant(
      balls.includes(outlierBall),
      'Expecting the outlier ball to be in the list of balls',
    );

    this._balls = balls;
    this._logType = logType;
    this._outlierBall = outlierBall;
    this._outlierWeightType = outlierWeightType;
    this._scaleRuns = [];
    this._strategyStatus = 'RUNNING_STRATEGY';
  }
}
