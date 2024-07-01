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
 * Lower-cases the first letter of `str` if the first and second letter is also
 * lowercase.
 */
export function toFirstLowerCase(str: string) {
  const secondCharacter = str.at(1);
  return secondCharacter && secondCharacter === secondCharacter.toLocaleLowerCase()
    ? str[0].toLocaleLowerCase() + str.slice(1)
    : str;
}

/**
 * Takes a scriptName and returns its "base name," i.e. the trailing name
 * component.
 */
export function scriptBasename(scriptFullName: string) {
  return scriptFullName.split(' ').at(-1)!;
}
