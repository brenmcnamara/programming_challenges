# Weighing Balls

## The Problem

You have 12 balls and 1 scale. There is 1 ball in the pile of 12 that weighs different than the other 11 balls. You are not sure if that ball weighs more or less than the other balls, and the weight difference is too small to identify by physically holding the balls and comparing weights. The only way to determine the relative weights of the balls is to use the scale. The scale has 1 tray on either side of it. You can put however many balls on each tray, and the scale will tip towards the heavier side (or stay flat if the two sides have the same weight). We want to optimize the use of the scale, so we are using it in as few weighings as possible. The goal is to write a program that finds the optimal solution to this problem.

Define a function "generateStrategy" that will return a strategy object to perform the weighing. A function "evaluateStrategy" is defined to evaluate the strategy that was generated. It will output the maximum number of weighings needed to identify the outlier ball. This function assumes that the strategy implemented is deterministic (does not use any random process for determining weighing process).
