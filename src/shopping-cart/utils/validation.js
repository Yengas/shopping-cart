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

/**
 * Check if the given instance is a enum of the type of given klass
 * @param instance
 * @param klass
 */
function isEnum(instance, klass) {
  return Object.values(klass).includes(instance);
}

/**
 * Check if the given string is a valid id
 * @param str
 */
function isId(str) {
  return str === null || isNonNegativeNumber(parseInt(str, 10));
}

module.exports = {
  isString,
  isNonEmptyString,
  isMaybeOfType,
  isNumber,
  isNonNegativeNumber,
  isNonNegativeInteger,
  isEnum,
  isId,
};
