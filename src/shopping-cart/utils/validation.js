/**
 * @param {String} str
 * @returns {boolean}
 */
function isString(str) {
  return str && str.constructor === String;
}

/**
 * Checks the variable is string and trimmed length is above zero
 * @param {String} str
 * @returns {boolean}
 */
function isNonEmptyString(str) {
  return isString(str) && str.trim().length > 0;
}

/**
 * Given a value, and a class, checks that the value is either null
 * or instance of the given class type.
 * @param {T|null} instance the value to check
 * @param {T} klass
 * @template T
 */
function isMaybeOfType(instance, klass) {
  return instance === null || instance instanceof klass;
}

/**
 * @param value
 * @returns {boolean}
 */
function isNumber(value) {
  return !Number.isNaN(value);
}

/**
 * @param value
 * @returns {boolean}
 */
function isNonNegativeNumber(value) {
  return isNumber(value) && value >= 0;
}

/**
 * @param value
 * @returns {boolean}
 */
function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value > 0;
}

module.exports = {
  isString,
  isNonEmptyString,
  isMaybeOfType,
  isNumber,
  isNonNegativeNumber,
  isNonNegativeInteger,
};
