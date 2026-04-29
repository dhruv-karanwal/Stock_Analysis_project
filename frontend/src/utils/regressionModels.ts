/**
 * Academic ML: Regression Models
 * Linear, Multiple, Polynomial, Ridge (L2), and Lasso (L1) Regression
 */

export interface RegressionData {
  X: number[]; // Features
  y: number[]; // Target values
}

export interface RegressionResult {
  coefficients: number[];
  intercept: number;
  predictions: number[];
  residuals: number[];
  trainR2: number;
  testR2: number;
  trainMSE: number;
  testMSE: number;
  trainMAE: number;
  testMAE: number;
  rmse: number;
}

export interface GradientDescentInfo {
  learningRate: number;
  iterations: number;
  convergenceStatus: 'converged' | 'not_converged' | 'oscillating';
  finalLoss: number;
  lossHistory: number[];
  iterationsToConverge: number;
}

/**
 * Linear Regression: y = β₀ + β₁x
 * Closed-form solution using Normal Equation
 */
export function linearRegression(
  X: number[],
  y: number[],
  testSize: number = 0.2
): RegressionResult {
  const n = X.length;
  const splitIdx = Math.floor(n * (1 - testSize));

  const trainX = X.slice(0, splitIdx);
  const trainY = y.slice(0, splitIdx);
  const testX = X.slice(splitIdx);
  const testY = y.slice(splitIdx);

  // Normal Equation: β = (X'X)⁻¹X'y
  const sumX = trainX.reduce((a, b) => a + b, 0);
  const sumY = trainY.reduce((a, b) => a + b, 0);
  const sumXY = trainX.reduce((sum, x, i) => sum + x * trainY[i], 0);
  const sumX2 = trainX.reduce((sum, x) => sum + x * x, 0);

  const m = trainX.length;
  const slope = (m * sumXY - sumX * sumY) / (m * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / m;

  const coefficients = [slope];
  const predictions = X.map((x) => intercept + slope * x);
  const trainPredictions = trainX.map((x) => intercept + slope * x);
  const testPredictions = testX.map((x) => intercept + slope * x);

  const residuals = y.map((yi, i) => yi - predictions[i]);

  // Calculate metrics
  const trainR2 = calculateR2(trainY, trainPredictions);
  const testR2 = calculateR2(testY, testPredictions);
  const trainMSE = calculateMSE(trainY, trainPredictions);
  const testMSE = calculateMSE(testY, testPredictions);
  const trainMAE = calculateMAE(trainY, trainPredictions);
  const testMAE = calculateMAE(testY, testPredictions);
  const rmse = Math.sqrt(trainMSE);

  return {
    coefficients,
    intercept,
    predictions,
    residuals,
    trainR2,
    testR2,
    trainMSE,
    testMSE,
    trainMAE,
    testMAE,
    rmse,
  };
}

/**
 * Polynomial Regression: y = β₀ + β₁x + β₂x² + ... + βₚxᵖ
 */
export function polynomialRegression(
  X: number[],
  y: number[],
  degree: number = 2,
  testSize: number = 0.2
): RegressionResult {
  const n = X.length;
  const splitIdx = Math.floor(n * (1 - testSize));

  // Create polynomial features
  const polyX = X.map((x) => {
    const row: number[] = [1]; // intercept
    for (let d = 1; d <= degree; d++) {
      row.push(Math.pow(x, d));
    }
    return row;
  });

  const trainX = polyX.slice(0, splitIdx);
  const trainY = y.slice(0, splitIdx);
  const testX = polyX.slice(splitIdx);
  const testY = y.slice(splitIdx);

  // Normal Equation for multivariate
  const coefficients = solveNormalEquation(trainX, trainY);
  const intercept = coefficients[0];

  const predictions = polyX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });
  const trainPredictions = trainX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });
  const testPredictions = testX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });

  const residuals = y.map((yi, i) => yi - predictions[i]);

  return {
    coefficients: coefficients.slice(1),
    intercept,
    predictions,
    residuals,
    trainR2: calculateR2(trainY, trainPredictions),
    testR2: calculateR2(testY, testPredictions),
    trainMSE: calculateMSE(trainY, trainPredictions),
    testMSE: calculateMSE(testY, testPredictions),
    trainMAE: calculateMAE(trainY, trainPredictions),
    testMAE: calculateMAE(testY, testPredictions),
    rmse: Math.sqrt(calculateMSE(trainY, trainPredictions)),
  };
}

/**
 * Ridge Regression: y = β₀ + β₁x + ... + λ||β||²₂
 * L2 Regularization - prevents large coefficients
 */
export function ridgeRegression(
  X: number[],
  y: number[],
  lambda: number = 0.1,
  testSize: number = 0.2
): RegressionResult {
  const n = X.length;
  const splitIdx = Math.floor(n * (1 - testSize));

  // Create feature matrix with intercept
  const polyX = X.map((x) => [1, x]);
  const trainX = polyX.slice(0, splitIdx);
  const trainY = y.slice(0, splitIdx);
  const testX = polyX.slice(splitIdx);
  const testY = y.slice(splitIdx);

  // Ridge: β = (X'X + λI)⁻¹X'y
  const m = trainX.length;
  const p = 2; // features
  const XtX = multiplyMatrices(transposeMatrix(trainX), trainX);
  const XtY = multiplyMatricesVector(transposeMatrix(trainX), trainY);

  // Add λI to diagonal
  const regularized = XtX.map((row, i) => [
    ...row.slice(0, i),
    row[i] + lambda,
    ...row.slice(i + 1),
  ]);

  const coefficients = gaussianElimination(regularized, XtY);
  const intercept = coefficients[0];

  const predictions = polyX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });
  const trainPredictions = trainX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });
  const testPredictions = testX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });

  const residuals = y.map((yi, i) => yi - predictions[i]);

  return {
    coefficients: coefficients.slice(1),
    intercept,
    predictions,
    residuals,
    trainR2: calculateR2(trainY, trainPredictions),
    testR2: calculateR2(testY, testPredictions),
    trainMSE: calculateMSE(trainY, trainPredictions),
    testMSE: calculateMSE(testY, testPredictions),
    trainMAE: calculateMAE(trainY, trainPredictions),
    testMAE: calculateMAE(testY, testPredictions),
    rmse: Math.sqrt(calculateMSE(trainY, trainPredictions)),
  };
}

/**
 * Lasso Regression: y = β₀ + β₁x + ... + λ||β||₁
 * L1 Regularization - shrinks some coefficients to zero
 */
export function lassoRegression(
  X: number[],
  y: number[],
  lambda: number = 0.1,
  testSize: number = 0.2
): RegressionResult {
  // Simplified Lasso using coordinate descent
  const n = X.length;
  const splitIdx = Math.floor(n * (1 - testSize));

  const polyX = X.map((x) => [1, x]);
  const trainX = polyX.slice(0, splitIdx);
  const trainY = y.slice(0, splitIdx);
  const testX = polyX.slice(splitIdx);
  const testY = y.slice(splitIdx);

  // Start with OLS solution
  const linearResult = linearRegression(X, y, testSize);
  let coefficients = [linearResult.intercept, linearResult.coefficients[0]];

  // Coordinate descent iterations
  for (let iter = 0; iter < 100; iter++) {
    for (let j = 0; j < coefficients.length; j++) {
      const residuals = trainY.map((yi, i) => {
        return yi - trainX[i].reduce((sum, val, k) => sum + (k === j ? 0 : val * coefficients[k]), 0);
      });

      const numerator = trainX.reduce((sum, row, i) => sum + row[j] * residuals[i], 0);
      const denominator = trainX.reduce((sum, row) => sum + row[j] * row[j], 0);

      const s = numerator / denominator;
      const softThreshold = s > 0 ? Math.max(0, s - lambda / denominator) : Math.min(0, s + lambda / denominator);
      coefficients[j] = softThreshold;
    }
  }

  const predictions = polyX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });
  const trainPredictions = trainX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });
  const testPredictions = testX.map((row) => {
    return row.reduce((sum, val, i) => sum + val * coefficients[i], 0);
  });

  const residuals = y.map((yi, i) => yi - predictions[i]);

  return {
    coefficients: coefficients.slice(1),
    intercept: coefficients[0],
    predictions,
    residuals,
    trainR2: calculateR2(trainY, trainPredictions),
    testR2: calculateR2(testY, testPredictions),
    trainMSE: calculateMSE(trainY, trainPredictions),
    testMSE: calculateMSE(testY, testPredictions),
    trainMAE: calculateMAE(trainY, trainPredictions),
    testMAE: calculateMAE(testY, testPredictions),
    rmse: Math.sqrt(calculateMSE(trainY, trainPredictions)),
  };
}

/**
 * Gradient Descent Optimizer
 * Iteratively updates weights to minimize loss function
 */
export function gradientDescentOptimizer(
  X: number[],
  y: number[],
  learningRate: number = 0.01,
  maxIterations: number = 1000,
  tolerance: number = 1e-6
): GradientDescentInfo {
  let m = X.length;
  let w = 0; // weight
  let b = 0; // bias
  const lossHistory: number[] = [];
  let previousLoss = Infinity;

  for (let iter = 0; iter < maxIterations; iter++) {
    // Predictions
    const predictions = X.map((x) => w * x + b);

    // Loss (MSE)
    const loss = predictions.reduce((sum, pred, i) => sum + Math.pow(y[i] - pred, 2), 0) / m;
    lossHistory.push(loss);

    // Gradients
    const dw = (-2 / m) * X.reduce((sum, x, i) => sum + x * (y[i] - predictions[i]), 0);
    const db = (-2 / m) * y.reduce((sum, yi, i) => sum + yi - predictions[i], 0);

    // Update weights
    w -= learningRate * dw;
    b -= learningRate * db;

    // Check convergence
    if (Math.abs(loss - previousLoss) < tolerance) {
      return {
        learningRate,
        iterations: iter,
        convergenceStatus: 'converged',
        finalLoss: loss,
        lossHistory,
        iterationsToConverge: iter,
      };
    }

    previousLoss = loss;
  }

  // Check if oscillating
  const lastLosses = lossHistory.slice(-10);
  const isOscillating = lastLosses.some((l) => l > lastLosses[0] * 1.5);

  return {
    learningRate,
    iterations: maxIterations,
    convergenceStatus: isOscillating ? 'oscillating' : 'not_converged',
    finalLoss: lossHistory[lossHistory.length - 1],
    lossHistory,
    iterationsToConverge: maxIterations,
  };
}

/**
 * Cost Functions & Evaluation Metrics
 */
export function calculateMSE(actual: number[], predicted: number[]): number {
  return actual.reduce((sum, a, i) => sum + Math.pow(a - predicted[i], 2), 0) / actual.length;
}

export function calculateMAE(actual: number[], predicted: number[]): number {
  return actual.reduce((sum, a, i) => sum + Math.abs(a - predicted[i]), 0) / actual.length;
}

export function calculateRMSE(actual: number[], predicted: number[]): number {
  return Math.sqrt(calculateMSE(actual, predicted));
}

export function calculateR2(actual: number[], predicted: number[]): number {
  const meanActual = actual.reduce((a, b) => a + b) / actual.length;
  const ssRes = actual.reduce((sum, a, i) => sum + Math.pow(a - predicted[i], 2), 0);
  const ssTot = actual.reduce((sum, a) => sum + Math.pow(a - meanActual, 2), 0);
  return 1 - ssRes / ssTot;
}

export function calculateMAPE(actual: number[], predicted: number[]): number {
  return (
    (actual.reduce((sum, a, i) => sum + Math.abs((a - predicted[i]) / a), 0) / actual.length) *
    100
  );
}

/**
 * Helper functions for matrix operations
 */
function solveNormalEquation(X: number[][], y: number[]): number[] {
  const Xt = transposeMatrix(X);
  const XtX = multiplyMatrices(Xt, X);
  const Xty = multiplyMatricesVector(Xt, y);
  return gaussianElimination(XtX, Xty);
}

function transposeMatrix(X: number[][]): number[][] {
  return X[0].map((_, i) => X.map((row) => row[i]));
}

function multiplyMatrices(A: number[][], B: number[][]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < B.length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function multiplyMatricesVector(A: number[][], b: number[]): number[] {
  return A.map((row) => row.reduce((sum, a, i) => sum + a * b[i], 0));
}

function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Back substitution
  const x: number[] = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }

  return x;
}
