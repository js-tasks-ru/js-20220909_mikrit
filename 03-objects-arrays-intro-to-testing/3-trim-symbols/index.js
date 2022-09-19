/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  if (size === 0) {
    return '';
  }

  let res = '';
  let count = 0;
  let letter = string[0];

  [...string].forEach(c => {
    if (count !== size && letter === c) {
      res += c;
      count++;
    } else if (letter !== c) {
      res += c;
      letter = c;
      count = 1;
    }
  });

  return res;
}
