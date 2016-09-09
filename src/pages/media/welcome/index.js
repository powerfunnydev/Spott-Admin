import Radium from 'radium';
import React, { Component } from 'react';
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

  render () {
    return (
      <div style={{ minWidth: 350 }}>
        <Hero />
        <About />
        <ForWho />
        <Partners />
        <Whitepapers />
        <HowItWorks />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    );
  }
}
