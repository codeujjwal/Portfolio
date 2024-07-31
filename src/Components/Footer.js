import React, { Component } from "react";

class Footer extends Component {
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
      <footer>
        <div
          className="row"
          style={{
            borderTop: "1px solid grey",
            paddingTop: "40px",
            marginTop: "20px",
          }}
        >
          <div className="twelve columns " style={{ textAlign: "center" }}>
            <ul className="social-links2">{networks}</ul>
            <ul>
              <li>THANK YOU</li>
            </ul>

            <ul className="copyright">
              Created with{" "}
              <span role="img" aria-label="heart">
                ❤️️
              </span>
              BY<li>UJJWAL SHARMA</li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
