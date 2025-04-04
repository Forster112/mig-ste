# MigSTE  [![npm downloads](https://img.shields.io/npm/d18m/mig-ste.svg?maxAge=5592000)](http://www.npmtrends.com/mig-ste) [![npm](https://img.shields.io/npm/v/mig-ste.svg)](https://www.npmjs.com/package/mig-ste)

A Rich Text Editor Component for React
> <i>stable version starts at v1.0.3</i>

## Quick Start

Make sure you have `react` and `react-dom`

```sh
npm install mig-ste
```

```jsx
import React, {useRef} from 'react'
import { Input } from 'mig-ste'
import 'mig-ste/dist/mig-ste.css';

function MyComponent() {
  const inputRef = useRef(null)

  const inputData = (content) => {
    console.log(content)
  }

  const formats = ['bold', 'italic', 'link']

  return (
    <>
      <Input
        formats={formats}
        placeholder="typing..."
        activeColor="#028ECA"
        editorClass='editor'
        ref={inputRef}
        handleContentChange={inputData} 
      />
    </>
  );
}

```

## Props

The MigSTE accepts properties that aids you customize the text editor to your taste.

### formats
An array of style formats needed

#### Available formats
* bold
* italic
* underline
* strikethrough
* link
* code
* list

#### sample usage
```js
const formats = ['bold', 'italic', 'link']
```

### handleContentChange
A function that return your editor content in real time (works like `useState`)

#### sample usage
``` jsx
import React from 'react'
import { Input } from 'mig-ste'
import 'mig-ste/dist/mig-ste.css';

function MyComponent() {

  const inputData = (content) => {
    console.log(content)
  }

  return (
    <>
      <Input handleContentChang={inputData} />
    </>
  );
}
```
### ref
Allows you to pass a `ref` down to the editor

#### sample usage

```jsx
import React, {useRef} from 'react'
import { Input } from 'mig-ste'
import 'mig-ste/dist/mig-ste.css';

function MyComponent() {
  const inputRef = useRef(null)

  return (
    <>
      <Input ref={inputRef} />
      <button onClick={()=> console.log(inputRef.current.innerHTML)}>Log to Console</button>
    </>
  );
}
```
### id
id of the editor

### placeholder
A string of text to be used as placeholder

### editorClass
A string of to be applied to the editor box

### activeColor
A string of color hex to be used for active style highlight
  
### buttonWrapClass
A string class to be applied to the button container

### buttonsClass
A string class to be applied to the style buttons

-----------

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated be it issues, upgrades, or updates.
1. Fork the project
2. Clone repository
3. Create your Feature Branch
```sh
git checkout -b feature/AmazingFeature
```
4. Commit your Changes
```sh
git commit -m "An Amazing feature"
```
5. Push to the Branch
```sh
git push origin feature/AmazingFeature
```
6. Open a Pull Request

## Future Road Map and Things You can Contribute to

+ A more customizable editor
+ Markdown compatible
+ More style format inclusion
+ Bug fixes

## License
Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Contact
Forster Udemezue
[linkedin](https://www.linkedin.com/in/forster-udemezue-c/)

Copyright (c) 2025

