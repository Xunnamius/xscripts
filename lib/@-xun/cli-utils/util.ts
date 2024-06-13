/**
 * Upper-cases the first letter of `str`.
 */
export function toSentenceCase(str: string) {
  return str[0].toLocaleUpperCase() + str.slice(1);
}

/**
 * Upper-cases the first letter of `str` wrt spaces (underscores).
 */
export function toSpacedSentenceCase(str: string) {
  let updatedStr = toSentenceCase(str);
  let indexOf = updatedStr.indexOf('_');

  while (indexOf !== -1) {
    updatedStr = updatedStr.slice(0, indexOf) + ' ' + updatedStr.slice(indexOf + 1);
    indexOf = updatedStr.indexOf('_', indexOf + 1);
  }

  return updatedStr;
}

/**
 * Lower-cases the first letter of `str`.
 */
export function toFirstLowerCase(str: string) {
  return str[0].toLocaleLowerCase() + str.slice(1);
}
