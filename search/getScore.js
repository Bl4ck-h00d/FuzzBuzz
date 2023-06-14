/**
 * Compute and return the score for a match with "errors" error and "currentLocation" location.
 *
 * Score = (0.0 = good, 1.0=bad)
 */

const getScore = (
  pattern,
  { errors = 0, currentLocation = 0, expectedLocation = 0, distance = 100 } = {}
) => {
  const accuracy = errors / pattern.length;
  const proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    return proximity ? 1.0 : accuracy;
  }

  return accuracy + proximity / distance;
};

export default getScore
