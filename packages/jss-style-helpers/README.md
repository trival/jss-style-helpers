# jss-style-helpers

Custom react-jss theme with helper functions based on system ui theme
specification

## Installation

This package works with [react-jss](https://www.npmjs.com/package/react-jss)

```bash
npm install react-jss jss-style-helpers
# or yarn
yarn add react-jss jss-style-helpers
```

## Usage

Create a theme

```javascript
// theme.js
import { makeStyleTheme } from 'jss-style-helpers'

const themeConfig = {
  spacing: ['0', '.25rem', '.5rem', '1rem', '2rem', '4rem'],
  breakpoints: ['640px', '920px', '1200px'],
  colors: {
    light: '#eee',
    dark: '#222',
    red: 'tomato',
  },
}

const { theme, makeStyles } = makeStyleTheme(themeConfig)
export { theme, makeStyles }

// This is your typescript theme type, if you need it
export type Theme = typeof theme
```

Add the theme to your react component hierarchy with the react-jss
ThemeProvider.

```javascript
// app.js
import { ThemeProvider } from 'react-jss'
import { theme } from './theme'
import YourMainComponent from './main'

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourMainComponent />
    </ThemeProvider>
  )
}
```

Then use the generated `makeStyle` function to create jss style hooks for your
components.

```javascript
// main.js

import { makeStyles } from '../components/theme'

export default () => {
  const styles = useStyles()
  return <h1 className={styles.foo}>Hello World</h1>
}

const useStyles = makeStyles($ => ({
  // $ is your theme, choose whatever name you want :)

  foo: $.compose(
    // compose your helpers

    // reset horizontal margin: {marginLeft: 0, marginRight: 0}
    $.mx(0),

    // responsive vertical margin, respects the 3 defined breakpoints
    $.my(1, 2, 3, 4),

    // responsive padding
    $.p(2, 3, 4),

    // backgroundColor
    $.bg($.colors.red),

    // color string is read from `colors` theme property
    $.c('light'),

    // use other react-jss style properties
    {
      boxShadow: `0 2px 3px ${$.colors.dark}`,
    },
  ),
}))
```

The `makeStyle` function simply forwards to react-jss `createUseStyles`, but
adds typescript autocompletions for all the helpers and theme properties
accessible in your theme. It uses the material-ui type definitions for
autocompletions, but otherwise no other code is imported from material-ui. If
you are not using typescript, you can as well just use the `createUseStyles`
function directly

## Inspiration

This library is strongly inspired by
[`Styled System`](https://styled-system.com/) and
[`System UI`](https://system-ui.com/). The theme configuration respects the
[System UI Theme Specification](https://system-ui.com/theme) and the functions
try to follow the `Styled System` properties behavior.

## Documentation

Following functions are available in your theme:

### Composition

- `compose`  
   composes multiple style objects into one.

### Spacing

- `margin` (alias: `m`)
- `marginTop` (alias: `mt`)
- `marginBottom` (alias: `mb`)
- `marginLeft` (alias: `ml`)
- `marginRight` (alias: `mr`)
- `marginHorizontal` (alias: `mx`)
- `marginVertical` (alias: `my`)
- `padding` (alias: `p`)
- `paddingTop` (alias: `pt`)
- `paddingLeft` (alias: `pl`)
- `paddingRight` (alias: `pr`)
- `paddingHorizontal` (alias: `px`)
- `paddingVertical` (alias: `py`)
- `top` (alias: `t`)
- `bottom` (alias: `b`)
- `left` (alias: `l`)
- `right` (alias: `r`)

Responsive spacing functions. String values and indices are looked up in the
`spacing` (or `space`) theme object.

### Color

- `color` (alias: `c`)
- `backgroundColor` (alias: `bg`)

Responsive color functions. String values and indices are looked up in the
`colors` theme object.

### Size

- `width` (alias: `w`)
- `maxWidth` (alias: `wMax`)
- `minWidth` (alias: `wMin`)
- `height` (alias: `h`)
- `maxHeight` (alias: `hMax`)
- `minHeight` (alias: `hMin`)

Responsive size functions. String values and indices are looked up in the
`sizes` theme object.

### Other

- `position` (alias: `pos`)
- `display` (alias: `d`)

These provide just responsive shortcuts without index lookups.

## Development

### Tests

```bash
yarn test
# for watch mode
yarn test:watch
```

## Contributing

Your contributions and suggestions are greatly appreciated. Submit you issues
and PRs on [github](https://github.com/trival/jss-style-helpers). Please add
unit tests for any new or changed functionality. Format, lint and test your code
with the provided configurations.

## License

Distributed under the MIT License. See LICENSE for more information.
