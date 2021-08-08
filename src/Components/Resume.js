import React, { Component } from "react";
class Resume extends Component {
  render() {
    if (this.props.data) {
      var education = this.props.data.education.map(function (education) {
        return (
          <div key={education.school}>
            <h3>{education.school}</h3>
            <p className="info">
              {education.degree} <span>&bull;</span>
              <em className="date">{education.graduated}</em>
            </p>
            <p>{education.description}</p>
            <br />
          </div>
        );
      });
      var work = this.props.data.work.map(function (work) {
        return (
          <div key={work.company}>
            <h3>{work.company}</h3>
            <h6>{work.title}</h6>
            <p>{work.description}</p>
            <br />
          </div>
        );
      });
      // var skills = this.props.data.skills.map(function (skills) {
      //   return (
      //     <li className="skill" key={skills.name}>
      //       {skills.name}
      //     </li>
      //   );
      // });
    }

    return (
      <section id="resume">
        <div className="row education">
          <div className="three columns header-col">
            <h1>
              <span>Education</span>
            </h1>
          </div>

          <div className="nine columns main-col">
            <div className="row item">
              <div className="twelve columns">{education}</div>
            </div>
          </div>
        </div>

        <div className="row work">
          <div className="three columns header-col">
            <h1>
              <span>Experience</span>
            </h1>
          </div>

          <div className="nine columns main-col">{work}</div>
        </div>

        <div className="row skill">
          <div className="three columns header-col">
            <h1>
              <span>Skills</span>
            </h1>
          </div>

          <div className="nine columns main-col">
            {/* <ul className="skills">{skills}</ul> */}
            <div className="skilldata">
              <li>
                I Have a good knowledge of React with Redux, Hooks and much
                more.
              </li>
              <li>
                I can work with class based as well functional components in
                React.
              </li>
              <li>I can work on apps using Expo and Ionic as well</li>
              <li>
                I can create API's using NodeJs, ExpressJs and MongoDB and can
                use them in React.
              </li>
              <li>I can work with any 3rd party library in Javascript</li>
              <li>I Also have basic knowledge of C, C++, Python.</li>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Resume;
