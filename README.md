# React-pae

[![npm version](https://badge.fury.io/js/react-pae.svg)](https://badge.fury.io/js/react-pae)

React-pae is a very tiny util that can help you create "arePropsEqual" functions with ease. 
## Features

- TypesScript support for strict type checking when comparing props
- Very small library, but saves you code
- Support for shallow, deep and skipping equality checks
- BYOC (Bring Your Own Comparer). Determine for yourself how props should be compared.
- Actually works with any `(prev, next) => boolean` callback
- Combine multiple "settings".

## Quick start

### Installation

```bash
yarn add react-pae

or

npm i --save react-pae
```

### Example

Imagine we have this heavy month component from which its usage is simplified in the code sample below. It probably exists in a calendar component that has a lot of interactions hypothetically.

```tsx
import propsAreEqual from 'react-pae';

const Month = props => {
  return (
    <div>
      {props.date.getMonth()}
      <button onClick={props.onClick}>open month</button>
      {children}
    </div>
  );
};

export default React.memo(
  Month,
  propsAreEqual({
    // BYOC, we can create our own comparer as direct date comparisons (new Date() !== new Date()) don't work
    date: (prev, next) => +prev === +next,
    // simple callback which is always of the same shape
    onClick: 'skip',
    // an array, but shallowly [] === [] = false, that's why we check it "deeply"
    bookings: 'deep',

    // all other props are checked shallowly as you'd expect with solely using `React.memo()`
  })
);
```

## Motivation

When using the `React.memo()` HOC you can determine for yourself if a component needs to be rerendered. Especially when components are heavy on the performance aspect, this can be a nice addition in order to improve the performance. However, multiple times I've found myself repeating same code over and over again. Like using deep equality for certain props and then loop over the other ones to shallow ignore them. Even enable skipping some props that shouldn't be considered.

**Note** **that you could, and probably most of the time should, use the hooks `useMemo` and `useCallback` in order to not rerender when basically using the same object or function. [See this great article by Kent C Dodds for more information on these hooks](https://kentcdodds.com/blog/usememo-and-usecallback/)**

However, sometimes you want to have a little more control and `React.memo()` is a great tool for that. To make its use a little bit easier this package can help you.