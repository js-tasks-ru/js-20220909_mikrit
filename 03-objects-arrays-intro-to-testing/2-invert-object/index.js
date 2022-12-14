/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

  if (!obj) {
    return;
  }

  let newObj = {};

  for (const [key, val] of Object.entries(obj)) {
    newObj[val] = key;
  }

  return newObj;
}
