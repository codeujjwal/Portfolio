import React, { Component } from "react";
import resume from "./resume.pdf";

class About extends Component {
  render() {
    if (this.props.data) {
      var name = this.props.data.name;
      var profilepic = "images/" + this.props.data.image;
      var bio = this.props.data.bio;
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
              A talented individual who always seeks for new opportunities and
              accept challanges for self development. A full stack developer
              mainly focusing and working on frontend developement with an
              emphasis JavaScript, React.
            </p>
            <p>
              An engineering student pursuing B.Tech in Computer Science
              Engineering(CSE) from IMS engineering college and is part of many
              communities with his own club as Mind Optimizers and has served as
              a mentor and speaker at various workshops.
            </p>
            <p>
              Previously worked as a React native developer at 3 diffrent
              startups and as a freelance web developer as well and having an
              experience of more than 1 year. Worked on more than 10 projects
              during my journey. lets connect !!
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
