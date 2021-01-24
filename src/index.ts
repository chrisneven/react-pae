import isEqual from 'lodash/isEqual';

export type CustomEqualityFn<T> = (prev: T, next: T) => boolean;

type Equality = 'deep' | 'skip' | 'shallow';

type SettingsEqualityMap<T> = {
  [K in keyof T]?: Equality | CustomEqualityFn<T[K]>;
};

const handleSettingsPerProp = <T>(
  prev: T,
  next: T,
  settings: SettingsEqualityMap<T>
) => {
  for (const key of Object.keys(prev) as Array<keyof T>) {
    const setting = settings[key];

    if ((!setting || setting === 'shallow') && prev[key] !== next[key]) {
      return false;
    }

    if (setting === 'skip') {
      continue;
    }

    if (setting === 'deep') {
      const result = isEqual(prev[key], next[key]);
      if (!result) {
        return false;
      }
    }

    if (typeof setting === 'function') {
      const result = setting(prev[key], next[key]);
      if (!result) {
        return false;
      }
    }
  }
  return true;
};

/**
 *
 * This util function creates a comparer function that can be used when implementing `React.memo()`.
 *
 * @param settings each settings param you can give an argument that represents a comparing "setting" and this
 *  can be a different way of comparing previous and next props. Basically it comes down to three ways of comparing props.
 *  Deep, using lodash's `isEqual`,shallow like you'd do normally or creating a custom compare function. With these three ways
 *  you can create efficient comparing functions.
 *
 *      1.  An object with for each a different way of comparing, 'shallow' is default. Can also be 'deep' | 'skip' or a custom
 *          function.
 *      2.  'deep' | 'shallow'.
 *      3.  A custom compare function.
 *
 */
const propsAreEqual = <T>(
  ...settings: Array<
    SettingsEqualityMap<T> | Exclude<Equality, 'skip'> | CustomEqualityFn<T>
  >
) => {
  return (prev: T, next: T) => {
    for (const setting of settings) {
      if (typeof setting === 'object') {
        const result = handleSettingsPerProp(prev, next, setting);
        if (!result) {
          return false;
        }
      }

      if (typeof setting === 'function') {
        const result = setting(prev, next);
        if (!result) {
          return false;
        }
      }

      if (setting === 'deep') {
        const result = isEqual(prev, next);
        if (!result) {
          return false;
        }
      }

      if (setting === 'shallow') {
        for (const key of Object.keys(prev) as Array<keyof T>) {
          if (prev[key] !== next[key]) {
            return false;
          }
        }
      }
    }
    return true;
  };
};

export type PropsAreEqual = typeof propsAreEqual;

export default propsAreEqual;
