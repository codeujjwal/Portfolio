import React, { Component } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

class Header extends Component {
  componentDidUpdate() {
    AOS.init();
  }
  render() {
    if (this.props.data) {
      var name = this.props.data.name;
      var networks = this.props.data.social.map(function (network) {
        return (
          <li key={network.name}>
            <a href={network.url}>
              <i className={network.className}></i>
            </a>
          </li>
        );
      });
    }
    return (
      <header id="home">
        <nav id="nav-wrap">
          <ul id="nav" className="nav">
            <li className="current">
              <a className="smoothscroll" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#about">
                About
              </a>
            </li>
            {/* <li>
              <a className="smoothscroll" href="#resume">
                Skills
              </a>
            </li> */}
            <li>
              <a className="smoothscroll" href="#portfolio">
                Projects
              </a>
            </li>
          </ul>
        </nav>
        <div className="row banner">
          <div
            className="banner-text"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <h1>
              Hi, My name is <span>{name}</span>
            </h1>
            <h2>
              I am a <span>Student</span> & a <span>Full stack developer</span>
            </h2>
            <br />
            <ul className="social">{networks}</ul>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
