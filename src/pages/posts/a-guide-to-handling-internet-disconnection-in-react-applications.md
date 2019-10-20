---
title: A Guide To Handling Internet Disconnection In React Applications.
date: '2019-02-02'
thumb_img_path: images/internet-disconnection.jpg
content_img_path: images/internet-disconnection.jpg
excerpt: >-
  Have you ever tried clicking on a button or access a service on any application numerous times without getting any feedback?
template: post
---

![Network router](/images/internet-disconnection.jpg)

Have you ever tried clicking on a button or access a service on any application numerous times without getting any feedback?

Such could leave you with some unanswered questions like "is my request being processed?", "is the application server down?", etc. and sometimes it might be due to losing your internet connection. This could decrease user retention rate on your application if proper attention is not paid to interactivity and how it affects your users.

This article will provide you with a means to handle changes to your users' internet connection on your application.

### What we will build

A webpage in React that displays a list of images.

### What you need to know

* Familiarity with React components.
* Familiarity with ES6.

Let's dive right in.
We will be using the create-react-app package to bootstrap our application.
*Open your terminal and run:*

```
  Bootstrap your application using:
  $ npx create-react-app name-of-your-application (Do this if you have Node.js installed).
```

If you do not have Node.js installed, checkout the [Node platform](https://nodejs.org/en/) for installation guide.

When that is done, open the folder you just created in your editor of choice. You should have the following folder structure.

![Folder structure after installation ><](/images/folder-structure-0.1.png)
> Image 1: Folder structure after bootstrapping your app with create-react-app.

Create a folder inside src (I called mine "helper") and add a file named images.js. This file will hold an array of images that we want to render on the webpage.
*Add the following to the image file created:*

```javascript
const images = [
  {
    id: 1,
    image: 'https://picsum.photos/200/300/?random',
  },
  {
    id: 2,
    image: 'https://picsum.photos/250/300/?random',
  },
  {
    id: 3,
    image: 'https://picsum.photos/210/300/?random',
  },
  {
    id: 4,
    image: 'https://picsum.photos/240/300/?random',
  },
  {
    id: 5,
    image: 'https://picsum.photos/260/300/?random',
  },
  {
    id: 6,
    image: 'https://picsum.photos/260/300/?random',
  },
  {
    id: 7,
    image: 'https://picsum.photos/250/300/?random',
  },
  {
    id: 8,
    image: 'https://picsum.photos/260/300/?random',
  },
];

export default images;
```

*Replace the content of App.css with the styles below:*

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

*Do likewise to the index.css file:*

```css
body {
  margin: 0;
  padding: 0;
  font-family: Georgia, 'Times New Roman', Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
```

The concept of higher order components empowers us to create abstractions over a component that can be easily reused on your platform. For the sake of brevity, I would suggest you check out this article, https://alligator.io/react/higher-order-components/ on HOCs.

Create another folder in the src folder called Hoc and a file called NetworkDetector.jsx inside it.

*Paste the following content in the file:*

```javascript
import React, { Component } from 'react';

export default function (ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false
    }

    componentDidMount() {
      this.handleConnectionChange();
      window.addEventListener('online', this.handleConnectionChange);
      window.addEventListener('offline', this.handleConnectionChange);
    }

    componentWillUnmount() {
      window.removeEventListener('online', this.handleConnectionChange);
      window.removeEventListener('offline', this.handleConnectionChange);
    }


    handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';

      if (condition === 'online') {
        const webPing = setInterval(
          () => {
            fetch('//google.com', {
              mode: 'no-cors',
              })
            .then(() => {
              this.setState({ isDisconnected: false }, () => {
                return clearInterval(webPing)
              });
            }).catch(() => this.setState({ isDisconnected: true }) )
          }, 2000);

        return;
      }

      return this.setState({ isDisconnected: true });
    }

    render() {
      const { isDisconnected } = this.state;

      return (
        <div>
          { isDisconnected && (<div className="internet-error">
              <p>Internet connection lost</p>
            </div>)
          }
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  return NetworkDetector;
}
```

In the component above, we have the **handleConnectionChange** method that updates the **isDisconnected** property in our local state as a result of a change in the Javascript **"navigator.onLine"** property which returns a boolean. This boolean is changed and updated accordingly based on the browser's ability to fetch any resource on the internet. The **window.online** and **window.offline** event listener notices this change and fires the handleConnectionChange method.
The **navigator.onLine** property is not foolproof and one concern is that a machine can be connected to a network or a virtual one and not have internet access.

#### How has this been addressed?
An additional check was added to **if (condition === 'online')** in the **handleConnectionChange** method which sends a request to google.com with an interval of two seconds. This check helps to ensure that the browser is not only online but has internet access. The **setInterval** is also cleared using the **clearInterval** method once the online status is confirmed to avoid sending another request.

#### Why choose google.com?
The reason behind sending the get request to google.com instead of any random platform is because it has great uptime. The idea here is to always send the request to a service that is always online. If you have a server, you could create a dedicated route that can replace the google.com domain but you have to be sure that it has an amazing uptime.

*Replace the content of App.js with the following:*

```javascript
import React, { Component } from 'react';

import './App.css';
import images from './helper/images'
import NetworkDetector from './Hoc/NetworkDetector';

class App extends Component {
  renderImage() {
    return (
      <div className='image-list'>
        {images.map(data => <img src={data.image} alt='random' key={data.id} className="image" />)}
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <p className="page-title">The iDrag Imagery</p>
        {this.renderImage()}
      </div>
    );
  }
}

export default NetworkDetector(App);
```

The App.js component was bounded to, and wrapped with the **NetworkDetector** HOC by doing **NetworkDetector(App)**. If you do not want to wrap your HOC's this way, you could achieve similar results by wrapping the HOC in your route declaration when using the [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) package.

![App implementation](/images/idrag.gif)
> Gif: Output on the browser when the online status of the webpage is toggled

**A quick rundown of what we've done**
* We modified the content of **App.js** to render a list of images.

* We created a **NetworkDetector HOC** to listen for changes to internet connectivity and display a notification.
* We also made modifications to **App.css**, and **index.css** to properly arrange the content on our webpage.

#### What can be improved on?
Customize the notification to float on any page as opposed to staying atop all your web pages which would be impossible to see if you are not at the top of the page. This can be achieved using CSS or any alert packages like [sweetalert](https://sweetalert2.github.io/), [toastr](https://devpost.com/software/react-toastr), etc.

We've come to the end of this article and I hope this has helped shed light into handling and relaying internet connection status to your users. Thanks for reading, and please leave a comment if you've any question or feedback.

Feel free to go through the codebase at [iDrag github](https://github.com/Nedson202/iDrag-Imagery), and I am also open to any recommendations you may have.