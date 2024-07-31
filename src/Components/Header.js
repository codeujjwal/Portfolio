import React, { Component } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

class Header extends Component {
  componentDidUpdate() {
    AOS.init();
  }
  render() {
    if (this.props.data) {
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
        <img className="logo-pic" src="images/Code.png" alt="logo" />
        <button
          className="say-hello"
          onClick={() => {
            const email = "hello@codeujjwal.in";
            const subject = "Hello Mail";
            const body = "Hey Ujjwal Sharma,";

            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(body)}`;

            window.open(mailtoLink, "_blank");
          }}
        >
          Say Hello
        </button>
        <div className="row banner">
          <div
            className="banner-text"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <h1>Frontend Developer, Mentor, Speaker & Student</h1>
            <h2>
              <span>
                I code beautifully simple things, and I love what I do.
              </span>
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
