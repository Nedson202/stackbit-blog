---
title: A Quick Guide To React Testing Library(RTL)
date: '2019-10-20'
thumb_img_path: images/tapping-wis.jpeg
content_img_path: images/tapping-wis.jpeg
excerpt: >-
  User interface designs are moving away from the use of loading spinners, static progress bar, to content loaders also called skeleton screens to handle different loading states of an application or a view on display before a webpage is loaded.
  Obey the testing goat.
template: post
---

![Drawing infinite wisdom :)](/images/tapping-wis.jpeg)

User interface designs are moving away from the use of loading spinners, static progress bar, to content loaders also called skeleton screens to handle different loading states of an application or a view on display before a webpage is loaded.

A static progress bar or the use of spinners on a blank page can easily be a loading indicator on web pages but concern around their use is the fact that you could easily assume that the page being loaded has frozen if there is no observable change within a timeframe.

### Why are loading indicators important?
* It provides users with feedback notifying them that certain action is in progress.
* Loading indicators in the form of skeleton screens sometimes offer a visual representation of the pages' layout while in its loading phase.

### How popular platforms load their content and images

Netflix employs the use of content loaders as a placeholder for contents that are yet to be loaded and displayed.
Medium combines different techniques to manage content loading by using a skeleton screen to manage the loading of articles and sometimes a blurry lightweight version of an image that later transitions to the fully loaded image.

### What we will build and Why
A webpage in React that displays a list of dynamically rendered images.
* The image will be loaded on the browser first before being displayed as a whole. A loading indicator can be displayed during the loading process.
* It offers a means to specify and display an error message or a placeholder if an image fails to load instead of displaying the images' default broken avatar and alt text.


### What you need to know

* Familiarity with React components.
* Familiarity with ES6.

### Source Code
You can find the source code of what we will build [here](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2FNedson202%2FiDrag-Imagery%2Ftree%2Fimage-render-with-content-loader) and a demo [here](https://medium.com/r/?url=https%3A%2F%2Fnedson202.github.io%2FiDrag-Imagery%2F).

If you prefer to clone the repository and just read along, you can clone the repository to your machine using:

If you do not have `yarn` installed, you can do so using `npm i -g yarn`.

```
$ git clone https://github.com/Nedson202/iDrag-Imagery.git
$ cd iDrag-imagery
$ git checkout image-render-with-content-loader
$ yarn // install dependencies
$ yarn start
```

### Environment Setup
We are going to use `create-react-app` to bootstrap our application.

*On your terminal, run:*

```
  $ npx create-react-app your-app-name
  $ cd your-app-name
  $ yarn add react-content-loader
  $ yarn start
```

Open the bootstrapped project on your code editor.

The command above uses `npx` and this bootstraps our app using the `create-react-app` package without permanently installing `create-react-app` on our machine.
You can read more about `npx` [here](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)

Inside the '**src**' folder, create the following folders:
* '**Assets**' and add '_**image.js**_' file
* '**Components**' and move '_**App.js**_' into it
* '**ContentLoaders**'

### The ImageCard component

This component will be responsible for loading each image in the background whilst displaying a mini skeleton screen for each image being loaded. It will also be responsible for displaying an error message in place of an image that fails to load.

In the `renderImage` method, the first conditional statement renders our skeleton screen(ImageLoader component) and a `img` tag. The `img` tag has a `hide` property that tells the browser to hide the image from users. This tag also have other special properties like the `onLoad` and `onError` event.

The `imageRenderedStatus` method is bound to the `onLoad` event which is triggered after the image has be retrieved by the browser. This method signals our local state that the image has been retrieved by the browser.
When there's an error, the `handleImageLoadError` method bound to the `onError` event is triggered instead which updates our local state with an error message we want to display to our users.

When the ImageCard component re-renders, the initial image that was hidden will either be replaced with the error message we've specified or the image that was loaded depending on what event was triggered.

Inside the '**Components**' folder, create a file called '_**ImageCard.jsx**_' and add the following:

```javascript
import React, { Component, Fragment } from "react";
import ImageLoader from "../ContentLoaders/ImageLoader";

class ImageCard extends Component {
  state = {
    loadedErrorMessage: '',
    imageUrl: '',
    imageLoaded: false,
  };

  handleImageLoadError = () => {
    this.setState({
      loadedErrorMessage: "Unable to fetch image",
    });
  };

  imageRenderedStatus = image => () => {
    this.setState({
      imageLoaded: true,
      imageUrl: image,
      loadedErrorMessage: '',
    });
  };

  renderImage(imageData) {
    const { image, size } = imageData;
    const { loadedErrorMessage, imageUrl, imageLoaded } = this.state;
    
    if (!imageLoaded && !loadedErrorMessage.length) {
      return (
        <Fragment>
          <ImageLoader size={size} />
          <img
            src={image || ''}
            className="hide"
            onLoad={this.imageRenderedStatus(image)}
            onError={this.handleImageLoadError}
            alt="userImage"
          />
        </Fragment>
      )
    }

    if (loadedErrorMessage.length) {
      return (
        <span id="image-error-placeholder">
          <h1>{loadedErrorMessage}</h1>
          <p id="error-symbol">!</p>
        </span>
      )
    }

    return (
      <img
        src={imageUrl}
        className="image"
        alt="Random cap"
        onLoad={this.imageRenderedStatus}
      />
    )
  }

  render() {
    const { imageData } = this.props;
    return (
      <div>
        {this.renderImage(imageData)}
      </div>
    )
  }
}

export default ImageCard;
```

Now, let us create the skeleton screen we want to use as a placeholder when an image is loading. We'll use the `react-content-loader` package we installed earlier after bootstrapping our app with `create-react-app`.

Create a file called '_**ImageLoader**_' in the '**ContentLoaders**' folder created above and add the following:

```javascript
import React from 'react';
import ContentLoader from 'react-content-loader';

const ImageLoader =  ({ size }) => {
  const { height, width } = size;

  return (
    <ContentLoader
      rtl
      height={height}
      width={width}
      speed={2}
      primaryColor="#f3f3f3"
    >
      <rect x="0" y="0" rx="3" ry="3" width="201" height="272" />
    </ContentLoader>
  );
}

export default ImageLoader;
```

Add the following to '_**App.js**_' located in '**src/Components**':

```javascript
import React from "react";

import "../App.css";
import images from "../Assets/images";
import ImageCard from "./ImageCard";

const renderImages = () => {
  return (
    <div className="image-list">
      {images.map(data => (
        <ImageCard key={data.id} imageData={data} />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <p className="page-title">The iDrag Imagery</p>
      {renderImages()}
    </div>
  );
}

export default App;
```

In the above code snippet, we have a method called `renderImages`. This method maps through our list of images and passes each image to the `ImageCard` component that we created above.

Since we moved '**App.js**_' into our '**Components**' folder, change the '**App.js**_' import path in '**index.js**_' from:

```
  import App from './App';
```

to 

```
  import App from './Components/App';
```

Add the following to the '_**images.js**_' file:

```javascript
  const images = [
    {
      id: 1,
      image: 'https://lorempixel.com/200/300/abstract/3',
      size: {
        width: 200,
        height: 300,
      }
    },
    {
      id: 2,
      image: 'https://lorempixel.com/250/320/abstract/1',
      size: {
        width: 230,
        height: 300,
      }
    },
    {
      id: 3,
      image: 'https://lorempixel.com/210/300/abstract/9',
      size: {
        width: 210,
        height: 300,
      }
    },
    {
      id: 4,
      image: 'https://lorempixel.com/240/300/nightlife/1',
      size: {
        width: 240,
        height: 300,
      }
    },
    {
      id: 5,
      image: 'https://picsum.photos/265/300/?random',
      size: {
        width: 265,
        height: 300,
      }
    },
    {
      id: 6,
      image: 'https://lorempixel.com/255/300/technics',
      size: {
        width: 255,
        height: 300,
      }
    },
    {
      id: 7,
      image: 'https://lorempixel.com/210/300/sports/9',
      size: {
        width: 250,
        height: 300,
      }
    },
    {
      id: 8,
      image: 'https://picsum.photos/260/300/?random',
      size: {
        width: 260,
        height: 300,
      }
    },
  ];

  export default images;
```

Open the '_**App.css**_' file and add the following:

```css
.app {
  text-align: center;
}

.app p {
  font-size: 30px;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.app .page-title {
  font-size: 30px;
  font-weight: bold;
}

.hide {
  display: none;
}

#error-symbol {
    font-size: 50px;
    border: 1px solid;
    border-radius: 50%;
    height: 55px;
    width: 55px;
    margin: auto;
}

.internet-error {
  height: 60px;
  background: #ff8100;
  margin-top: 0;
  font-size: 20px;
}

.internet-error p {
  font-size: 25px;
  line-height: 60px;
  color: #fff;
  margin: 0;
}

.image-list {
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(4, 1fr);
  width: 1150px;
  margin: 100px auto;
}

.image:hover {
  animation: animate-image 0.5s;
  animation-iteration-count: infinite;
}

@keyframes animate-image {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-1px, -2px) rotate(0deg); }
}
```

### Current folder structure
![Current folder structure ><](/images/folder-structure-render-images-0.1.png)

At this point, the app should compile successfully on your terminal. Open the app on http://localhost:3000 on your browser and see the image content
loading in action.

![App implementation](/images/render-images.gif)
> Gif: Process of loading images on the browser