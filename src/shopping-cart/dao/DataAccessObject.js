/**
 * Given the index of the model convert it to index
 * @param {Number} idx
 * @returns {string}
 */
function convertIndexToId(idx) {
  return `${idx}`;
}

/**
 * Convert the given id to array index
 * @param {string} idStr
 * @returns {number}
 */
function convertIdToIndex(idStr) {
  return parseInt(idStr, 10) - 1;
}

/**
 * Simple in memory data access implementation.
 * Base class to extend for other models.
 */
class DataAccessObject {
  /**
   * Construct a new DAO with the type of given klass, and initial data in type of
   * the given klass. Inserts every model in the initialData into the DAO
   * @param klass
   * @param initialData
   */
  constructor(klass, initialData = []) {
    this.klass = klass;
    this.storage = [];

    initialData.forEach(model => this.insert(model));
  }

  /**
   * Given a model, insert it into the store, and return a new model with the
   * dao id assigned to it.
   * @param model
   */
  insert(model) {
    if (!(model instanceof this.klass)) {
      throw new Error('this model is not ');
    }

    const idStr = convertIndexToId(this.storage.length + 1);
    const newModel = model.withId(idStr);
    this.storage.push(newModel);
    return newModel;
  }

  /**
   * Assign the given model to the specific index, update operation
   * @param id
   * @param model
   * @returns {Category|Product}
   */
  replace(id, model) {
    const idx = convertIdToIndex(id);
    const newModel = model.withId(id);

    this.storage[idx] = newModel;
    return newModel;
  }

  /**
   * Given an id, return the model for it
   * @param id
   * @returns {*}
   */
  getForId(id) {
    const idx = convertIdToIndex(id);
    return this.storage[idx];
  }
}

module.exports = DataAccessObject;
