import React from 'react';
import _ from 'lodash';

import { Social } from '.';
import { Link, safePrefix } from '../utils';

export default class FullScreenNav extends React.Component {
  removeOverflow = () => {
    document.documentElement.style.overflow = 'unset';
  }

  render() {
    return (
      <div class="overlay">
        <div class="overlay-content">
          {_.map(_.get(this.props, 'pageContext.menus.main'), (item) => (
            <Link to={safePrefix(_.get(item, 'url'))} onClick={this.removeOverflow}>{_.get(item, 'title')}</Link>
          ))}
        </div>

        {_.get(this.props, 'pageContext.site.siteMetadata.header.has_social') &&
          <Social {...this.props} />
        }
      </div>
    );
  }
}
