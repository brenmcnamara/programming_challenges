/* @flow */

import Strategy, { NUMBER_OF_BALLS } from './Strategy';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { BallID } from './Strategy';

function UNKNOWN_OUTLIER_BALL(balls: Array<BallID>) {
  return null;
}

function NO_MORE_RUN(balls: Array<BallID>) {
  return invariant(
    false,
    'Trying to use the scale after the outlier ball was found',
  );
}

const NO_MORE_NEXT = {
  BALANCED: null,
  TIP_TO_LEFT: null,
  TIP_TO_RIGHT: null,
};

/**
 * This is the optimal strategy for finding the outlier ball. The goal of this
 * exercise is NOT to find the optimal strategy, but to write an operation
 * that generates the optimal strategy using some procedure. This strategy is
 * used to make sure that other strategies are optimal.
 */
export default class OptimalStrategy extends Strategy {
  runStrategy(balls: Array<BallID>): void {
    invariant(
      NUMBER_OF_BALLS === 12,
      'Optimal Strategy is hard-coded to work with exactly 12 balls.',
    );

    let node = DECISION_TREE;
    let outlierBall = node.getOutlierBall(balls);

    while (!outlierBall) {
      const { leftSide, rightSide } = node.getRun(balls);

      const result = this.__useScale(rightSide, leftSide);
      node = nullthrows(node.next[result]);
      outlierBall = node.getOutlierBall(balls);
    }

    this.__submitOutlierBall(outlierBall);
  }
}

const DECISION_TREE = {
  getOutlierBall: (balls: Array<BallID>) => null,
  getRun: (balls: Array<BallID>) => ({
    leftSide: [balls[0], balls[1], balls[2], balls[3]],
    rightSide: [balls[4], balls[5], balls[6], balls[7]],
  }),
  next: {
    // [0, 1, 2, 3] == [4, 5, 6, 7] NOTE: One of 8 through 11 is an outlier
    BALANCED: {
      getOutlierBall: UNKNOWN_OUTLIER_BALL,
      getRun: (balls: Array<BallID>) => ({
        leftSide: [balls[8]],
        rightSide: [balls[9]],
      }),
      next: {
        // [8] == [9] // NOTE: Either 10 or 11 is the outlier
        BALANCED: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[9]],
            rightSide: [balls[10]],
          }),
          next: {
            // [8] == [10]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[11],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [8] > [10]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[10],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [8] < [10]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[10],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
        // [8] > [9] NOTE: Either 8 is heavy or 9 is light
        TIP_TO_LEFT: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[8]],
            rightSide: [balls[10]],
          }),
          next: {
            // [8] == [10]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[9],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [8] > [10]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[8],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            TIP_TO_RIGHT: null, // This should never happen.
          },
        },
        // [8] < [9] NOTE: EIther 8 is light or 9 is heavy
        TIP_TO_RIGHT: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[8]],
            rightSide: [balls[10]],
          }),
          next: {
            // [8] == [10]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[9],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            TIP_TO_LEFT: null, // This should never happen.
            // [8] < [10]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[8],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
      },
    },
    // [0, 1, 2, 3] > [4, 5, 6, 7] NOTE: The outlier is in 0 through 7
    TIP_TO_LEFT: {
      getOutlierBall: UNKNOWN_OUTLIER_BALL,
      getRun: (balls: Array<BallID>) => ({
        leftSide: [balls[0], balls[1], balls[6]],
        rightSide: [balls[2], balls[3], balls[7]],
      }),
      next: {
        // [0, 1, 4] == [2, 3, 5] NOTE: The outlier is 6 or 7
        BALANCED: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[6]],
            rightSide: [balls[0]],
          }),
          next: {
            // [6] == [0]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[7],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [6] > [0]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[4],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [6] < [0]
            TIP_TO_RIGHT: null, // This should never happen
          },
        },
        // [0, 1, 4] > [2, 3, 5] NOTE: Either (0 or 1 is heavy) or 5 is light
        TIP_TO_LEFT: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[0]],
            rightSide: [balls[1]],
          }),
          next: {
            // [0] == [1]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[5],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [0] > [1]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[0],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [0] < [1]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[1],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
        // [0, 1, 4] < [2, 3, 5] NOTE: Either 4 is light or (2 or 3 is heavy)
        TIP_TO_RIGHT: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[2]],
            rightSide: [balls[3]],
          }),
          next: {
            // [2] == [3]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[4],
              getRun: (balls: Array<BallID>) => NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [2] > [3]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[2],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [2] < [3]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[3],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
      },
    },
    // [0, 1, 2, 3] < [4, 5, 6, 7] NOTE: The outlier is in 0 through 7
    TIP_TO_RIGHT: {
      getOutlierBall: UNKNOWN_OUTLIER_BALL,
      getRun: (balls: Array<BallID>) => ({
        leftSide: [balls[0], balls[1], balls[4]],
        rightSide: [balls[2], balls[3], balls[5]],
      }),
      next: {
        // [0, 1, 4] == [2, 3, 5] NOTE: The outlier is 6 or 7
        BALANCED: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[0]],
            rightSide: [balls[6]],
          }),
          next: {
            // [0] == [6]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[7],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [0] > [6]
            TIP_TO_LEFT: null, // This should never happen
            // [0] < [6]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[6],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
        // [0, 1, 4] > [2, 3, 5] NOTE: Either 4 is heavy or (2 or 3 is light)
        TIP_TO_LEFT: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[2]],
            rightSide: [balls[3]],
          }),
          next: {
            // [2] == [3]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[4],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [2] > [3]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[3],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [2] < [3]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[2],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
        // [0, 1, 4] < [2, 3, 5] NOTE: Either 4 is heavy or (0 or 1 is light)
        TIP_TO_RIGHT: {
          getOutlierBall: UNKNOWN_OUTLIER_BALL,
          getRun: (balls: Array<BallID>) => ({
            leftSide: [balls[0]],
            rightSide: [balls[1]],
          }),
          next: {
            // [0] == [1]
            BALANCED: {
              getOutlierBall: (balls: Array<BallID>) => balls[4],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [0] > [1]
            TIP_TO_LEFT: {
              getOutlierBall: (balls: Array<BallID>) => balls[1],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
            // [0] < [1]
            TIP_TO_RIGHT: {
              getOutlierBall: (balls: Array<BallID>) => balls[0],
              getRun: NO_MORE_RUN,
              next: NO_MORE_NEXT,
            },
          },
        },
      },
    },
  },
};
