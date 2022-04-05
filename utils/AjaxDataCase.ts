import _ from 'lodash';

export interface AjaxData {
  [key: string]: any;
}

export function toJsCaseArrayObject<T = AjaxData>(datas: AjaxData[]): T[] {
  return datas.map(data => {
    return toJsCaseObject(data);
  });
}

export function toJsCaseObject<T = AjaxData>(data: AjaxData): T {
  return _.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [_.camelCase(key)]: value,
    }),
    {},
  ) as T;
}

export function toRbCaseObject<T = AjaxData>(data: AjaxData): T {
  return _.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [_.snakeCase(key)]: value,
    }),
    {},
  ) as T;
}

export function nestedToJsCase<T = AjaxData>(data: unknown | unknown[]): T {
  let returnValue: unknown = data;
  if (Array.isArray(data)) {
    returnValue = data.map(nestedToJsCase);
  } else if (typeof data === 'object' && data !== null) {
    returnValue = _.entries(data).reduce<AjaxData>((obj, [key, value]) => {
      const camelKey = _.camelCase(key);
      obj[camelKey] = nestedToJsCase(value);
      return obj;
    }, {});
  }

  return returnValue as T;
}

export function nestedToRbCase<T = AjaxData>(data: unknown | unknown[]): T {
  let returnValue: unknown = data;
  if (Array.isArray(data)) {
    returnValue = data.map(nestedToRbCase);
  } else if (typeof data === 'object' && data !== null) {
    returnValue = _.entries(data).reduce<AjaxData>((obj, [key, value]) => {
      const snakeKey = _.snakeCase(key);
      obj[snakeKey] = nestedToRbCase(value);
      return obj;
    }, {});
  }
  return returnValue as T;
}
