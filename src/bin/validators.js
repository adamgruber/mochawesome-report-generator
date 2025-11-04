// From https://github.com/validatorjs/validator.js/blob/master/src/lib/util/assertString.js
function assertString(input) {
  if (input === undefined || input === null)
    throw new TypeError(`Expected a string but received a ${input}`);
  if (input.constructor.name !== 'String')
    throw new TypeError(
      `Expected a string but received a ${input.constructor.name}`
    );
}

// Adapted from https://github.com/validatorjs/validator.js/blob/master/src/lib/isUUID.js
export function isUUID(str) {
  assertString(str);
  // From https://github.com/uuidjs/uuid/blob/main/src/regex.js
  const uuidRegex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  return uuidRegex.test(str);
}

// Adapted from https://github.com/validatorjs/validator.js/blob/master/src/lib/isISO8601.js
export function isISO8601(str) {
  assertString(str);
  // From http://goo.gl/0ejHHW
  const iso8601 = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  return iso8601.test(str);
}
