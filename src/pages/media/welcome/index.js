import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import About from './about';
import Contact from './contact';
import Footer from '../../app/footer';
import ForWho from './forWho';
import Hero from './hero';
import HowItWorks from './howItWorks';
import Partners from './partners';
import Pricing from './pricing';
import Whitepapers from './whitepapers';

@Radium
export default class Welcome extends Component {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired
  }

  render () {
    return (
      <div style={{ minWidth: 350 }}>
        <Hero currentLocation={this.props.location}/>
        <About />
        <ForWho />
        <Partners />
        <Whitepapers />
        <HowItWorks />
        <Pricing />
        <Contact />
        <Footer currentLocation={this.props.location}/>
        {this.props.children}
      </div>
    );
  }
}
