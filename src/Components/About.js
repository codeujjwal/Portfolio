import React, { Component } from 'react';
import resume from './resume.pdf';

class About extends Component {
  render() {
    if (this.props.data) {
      var name = this.props.data.name;
      var profilepic = 'images/' + this.props.data.image;
      var city = this.props.data.address.city;
      var country = this.props.data.address.country;
      var phone = this.props.data.phone;
      var email = this.props.data.email;
    }

    return (
      <section
        id="about"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
      >
        <div className="row">
          <div className="three columns">
            <img className="profile-pic" src={profilepic} alt="profile pic" />
          </div>
          <div className="nine columns main-col">
            <h2>About Me</h2>
            <p>
              A Btech student and a Front-End Developer having experience of
              working on multiple projects using React-JS and React-Native both
              from scratch. Constructed multiple successful projects during my
              journey. A mentor and a speaker- guiding many students with there
              career. Always open for new opportunities and challenges.
            </p>
            <div className="row">
              <div className="columns contact-details">
                <h2>Contact Details</h2>
                <p className="address">
                  <span>{name}</span>
                  <br />
                  <span>
                    {city}, {country}
                  </span>
                  <br />
                  <span>{phone}</span>
                  <br />
                  <span>{email}</span>
                </p>
              </div>
              <div className="columns download">
                <p>
                  <a href={resume} download className="button">
                    <i className="fa fa-download"></i>Download Resume
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default About;
