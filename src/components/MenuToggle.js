import React from 'react';
import FullScreenNav from './FullScreenNav';

export default class MenuToggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNav: false
    };
  }

  toggleNav = () => {
    this.setState(prevState => {
      return {
        showNav: !prevState.showNav
      }
    }, () => {
      const { showNav } = this.state;
      const toggleBodyScroll = showNav ? 'hidden' : 'unset';

      document.documentElement.style.overflow = toggleBodyScroll;
    });
  }

  render() {
    const { showNav } = this.state;

    return (
      <React.Fragment>
        <button
          id="menu-toggle"
          className="menu-toggle"
          onClick={this.toggleNav}
        ><span className="screen-reader-text">Menu</span><span className="icon-menu"
          aria-hidden="true" />
        </button>

        {showNav && <FullScreenNav {...this.props} />}
      </React.Fragment>
    );
  }
}
