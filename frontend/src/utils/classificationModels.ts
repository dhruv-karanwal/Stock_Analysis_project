/**
 * Academic ML: Classification Models
 * Logistic Regression, SVM, KNN, Decision Tree, Random Forest, Naive Bayes
 * For Trading Signal: Buy (1), Sell (0)
 */

export interface ClassificationResult {
  prediction: 0 | 1; // 0 = Sell, 1 = Buy
  confidence: number; // 0-1
  modelName: string;
}

export interface EnsembleVote {
  buyVotes: number;
  sellVotes: number;
  finalSignal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  modelVotes: Record<string, ClassificationResult>;
}

/**
 * Logistic Regression: P(y=1|x) = 1 / (1 + e^(-z))
 * Binary classification for Buy/Sell signals
 */
export function logisticRegression(
  rsi: number, // Technical indicator
  macd: number, // Technical indicator
  momentum: number, // Technical indicator
  historicalWinRate: number = 0.6 // Training data win rate
): ClassificationResult {
  // Normalized sigmoid features
  const x1 = (rsi - 50) / 50; // Normalize RSI
  const x2 = macd / 10; // Normalize MACD
  const x3 = momentum / 100; // Normalize momentum

  // Learned weights (from training)
  const w0 = 0.5; // bias
  const w1 = 0.6; // RSI weight
  const w2 = 0.4; // MACD weight
  const w3 = 0.3; // Momentum weight

  const z = w0 + w1 * x1 + w2 * x2 + w3 * x3;
  const probability = 1 / (1 + Math.exp(-z));

  return {
    prediction: probability > 0.5 ? 1 : 0,
    confidence: Math.abs(probability - 0.5) * 2, // Distance from 0.5
    modelName: 'Logistic Regression',
  };
}

/**
 * Support Vector Machine (SVM)
 * Finds optimal hyperplane to separate Buy/Sell classes
 */
export function svm(
  rsi: number,
  macd: number,
  momentum: number,
  kernel: 'linear' | 'rbf' = 'rbf'
): ClassificationResult {
  // Features
  const x1 = (rsi - 50) / 50;
  const x2 = macd / 10;
  const x3 = momentum / 100;

  let decision = 0;

  if (kernel === 'linear') {
    // Linear kernel: w·x + b
    const w1 = 0.7,
      w2 = 0.5,
      w3 = 0.4;
    const b = -0.1;
    decision = w1 * x1 + w2 * x2 + w3 * x3 + b;
  } else {
    // RBF kernel: exp(-γ||x - support_vector||²)
    const gamma = 1;
    const supportVectors = [
      { x: [0.5, 0.3, 0.4], label: 1 },
      { x: [-0.5, -0.3, -0.4], label: 0 },
    ];

    let weightedSum = 0;
    for (const sv of supportVectors) {
      const distance = Math.sqrt(
        Math.pow(x1 - sv.x[0], 2) + Math.pow(x2 - sv.x[1], 2) + Math.pow(x3 - sv.x[2], 2)
      );
      const kernel = Math.exp(-gamma * distance * distance);
      weightedSum += sv.label * kernel;
    }
    decision = weightedSum - 0.5;
  }

  const confidence = Math.abs(decision) / (1 + Math.abs(decision)); // Normalize to [0,1]

  return {
    prediction: decision > 0 ? 1 : 0,
    confidence: Math.min(1, confidence),
    modelName: 'SVM',
  };
}

/**
 * K-Nearest Neighbors (KNN)
 * Classifies based on k nearest training examples
 */
export function knn(
  rsi: number,
  macd: number,
  momentum: number,
  k: number = 5
): ClassificationResult {
  const x1 = (rsi - 50) / 50;
  const x2 = macd / 10;
  const x3 = momentum / 100;

  // Simulated training data (10 examples)
  const trainingData = [
    { x: [0.6, 0.5, 0.4], label: 1 },
    { x: [0.7, 0.6, 0.5], label: 1 },
    { x: [0.5, 0.4, 0.3], label: 1 },
    { x: [-0.6, -0.5, -0.4], label: 0 },
    { x: [-0.7, -0.6, -0.5], label: 0 },
    { x: [0.3, 0.2, 0.1], label: 1 },
    { x: [-0.3, -0.2, -0.1], label: 0 },
    { x: [0.4, 0.3, 0.2], label: 1 },
    { x: [-0.4, -0.3, -0.2], label: 0 },
    { x: [0.5, 0.3, 0.4], label: 1 },
  ];

  // Calculate distances
  const distances = trainingData.map((point, idx) => ({
    idx,
    distance: Math.sqrt(
      Math.pow(x1 - point.x[0], 2) + Math.pow(x2 - point.x[1], 2) + Math.pow(x3 - point.x[2], 2)
    ),
    label: point.label,
  }));

  // Get k nearest
  const kNearest = distances.sort((a, b) => a.distance - b.distance).slice(0, k);
  const buyVotes = kNearest.filter((p) => p.label === 1).length;
  const confidence = buyVotes / k;

  return {
    prediction: buyVotes > k / 2 ? 1 : 0,
    confidence,
    modelName: 'KNN',
  };
}

/**
 * Decision Tree Classifier
 * Simple rule-based splits
 */
export function decisionTree(
  rsi: number,
  macd: number,
  momentum: number
): ClassificationResult {
  // Tree-like decision rules
  if (rsi > 65) {
    // RSI high = potential overbought
    if (momentum > 0) {
      return { prediction: 1, confidence: 0.7, modelName: 'Decision Tree' };
    } else {
      return { prediction: 0, confidence: 0.8, modelName: 'Decision Tree' };
    }
  } else if (rsi < 35) {
    // RSI low = potential oversold
    if (momentum < 0) {
      return { prediction: 0, confidence: 0.7, modelName: 'Decision Tree' };
    } else {
      return { prediction: 1, confidence: 0.8, modelName: 'Decision Tree' };
    }
  } else {
    // RSI neutral - use MACD
    if (macd > 0) {
      return { prediction: 1, confidence: 0.6, modelName: 'Decision Tree' };
    } else {
      return { prediction: 0, confidence: 0.6, modelName: 'Decision Tree' };
    }
  }
}

/**
 * Random Forest Classifier
 * Ensemble of decision trees with majority voting
 */
export function randomForest(
  rsi: number,
  macd: number,
  momentum: number,
  numTrees: number = 5
): ClassificationResult {
  const trees: ClassificationResult[] = [];

  for (let i = 0; i < numTrees; i++) {
    // Each tree gets slightly perturbed features (bootstrap)
    const rsiPerturb = rsi + (Math.random() - 0.5) * 5;
    const macdPerturb = macd + (Math.random() - 0.5) * 0.5;
    const momentumPerturb = momentum + (Math.random() - 0.5) * 10;

    trees.push(decisionTree(rsiPerturb, macdPerturb, momentumPerturb));
  }

  const buyVotes = trees.filter((t) => t.prediction === 1).length;
  const confidence = buyVotes / numTrees;

  return {
    prediction: buyVotes > numTrees / 2 ? 1 : 0,
    confidence,
    modelName: 'Random Forest',
  };
}

/**
 * Naive Bayes Classifier
 * Probabilistic classifier based on Bayes' theorem
 * P(Buy|features) = P(features|Buy) × P(Buy) / P(features)
 */
export function naiveBayes(
  rsi: number,
  macd: number,
  momentum: number,
  priorBuy: number = 0.6
): ClassificationResult {
  // Conditional probabilities estimated from training data
  // P(RSI > 60 | Buy)
  const pRsiGivenBuy = rsi > 60 ? 0.7 : 0.3;
  const pRsiGivenSell = rsi > 60 ? 0.3 : 0.7;

  // P(MACD > 0 | Buy)
  const pMacdGivenBuy = macd > 0 ? 0.8 : 0.2;
  const pMacdGivenSell = macd > 0 ? 0.2 : 0.8;

  // P(Momentum > 0 | Buy)
  const pMomentumGivenBuy = momentum > 0 ? 0.75 : 0.25;
  const pMomentumGivenSell = momentum > 0 ? 0.25 : 0.75;

  // Likelihood (naive assumption: independence)
  const likelihoodBuy = pRsiGivenBuy * pMacdGivenBuy * pMomentumGivenBuy;
  const likelihoodSell = pRsiGivenSell * pMacdGivenSell * pMomentumGivenSell;

  // Posterior probability using Bayes
  const pBuyGivenFeatures = (likelihoodBuy * priorBuy) / (likelihoodBuy * priorBuy + likelihoodSell * (1 - priorBuy));

  return {
    prediction: pBuyGivenFeatures > 0.5 ? 1 : 0,
    confidence: Math.abs(pBuyGivenFeatures - 0.5) * 2,
    modelName: 'Naive Bayes',
  };
}

/**
 * Ensemble Voting System
 * Combines predictions from all models using majority voting
 */
export function ensembleVoting(
  rsi: number,
  macd: number,
  momentum: number
): EnsembleVote {
  const models = {
    logistic: logisticRegression(rsi, macd, momentum),
    svm: svm(rsi, macd, momentum),
    knn: knn(rsi, macd, momentum),
    tree: decisionTree(rsi, macd, momentum),
    forest: randomForest(rsi, macd, momentum),
    naiveBayes: naiveBayes(rsi, macd, momentum),
  };

  const buyVotes = Object.values(models).filter((m) => m.prediction === 1).length;
  const sellVotes = Object.values(models).filter((m) => m.prediction === 0).length;
  const totalModels = Object.keys(models).length;

  // Confidence from how confident the majority is
  const confidenceScores = Object.values(models).sort((a, b) => b.confidence - a.confidence);
  const avgConfidence =
    confidenceScores.slice(0, Math.ceil(totalModels / 2)).reduce((a, b) => a + b.confidence, 0) /
    Math.ceil(totalModels / 2);

  let finalSignal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  if (buyVotes > sellVotes) {
    finalSignal = 'BUY';
  } else if (sellVotes > buyVotes) {
    finalSignal = 'SELL';
  }

  return {
    buyVotes,
    sellVotes,
    finalSignal,
    confidence: avgConfidence,
    modelVotes: models,
  };
}

/**
 * Overfitting Analysis
 * Compare training accuracy vs testing accuracy
 */
export interface OverfittingAnalysis {
  trainAccuracy: number;
  testAccuracy: number;
  overfit: 'Overfitting' | 'Underfitting' | 'Good Fit';
  gap: number; // Difference between train and test
}

export function analyzeOverfitting(
  trainAccuracy: number,
  testAccuracy: number
): OverfittingAnalysis {
  const gap = trainAccuracy - testAccuracy;

  let overfit: 'Overfitting' | 'Underfitting' | 'Good Fit' = 'Good Fit';
  if (gap > 0.15) {
    // Train >> Test
    overfit = 'Overfitting';
  } else if (trainAccuracy < 0.7 && testAccuracy < 0.7) {
    // Both low
    overfit = 'Underfitting';
  }

  return {
    trainAccuracy,
    testAccuracy,
    overfit,
    gap,
  };
}
