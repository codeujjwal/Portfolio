import React, { Component } from "react";

class About extends Component {
  render() {
    return (
      <>
        <section
          id="about"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div
            className="row"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt="my pic"
              src="images/mypic.jpg"
              height="200px"
              width="200px"
              style={{ marginBottom: "30px", borderRadius: "200px" }}
            />
            <div>
              <h2>Hi, I am Ujjwal Sharma</h2>
              <p>
                A Front-End Developer based in Delhi, India, with over 3 years
                of experience in web and mobile application development. As a
                mentor and speaker, I share my expertise in React JS, React
                Native, HTML, CSS, JavaScript, Vite, Firebase, Redux, and
                Tailwind. I have built scalable, pixel-perfect UIs, led
                front-end teams, and ensured seamless product releases. My
                projects include a jewelry marketplace with an admin panel, a
                matrimonial platform, and an LMS for online teaching. My GitHub
                features over 20 personal projects.
              </p>
              <p style={{ marginTop: "20px" }}>
                I hold a Bachelor of Technology (Btech) in Computer Science
                Engineering and am pursuing a Master of Science (MS) in Computer
                Science with a specialization in cloud computing. I have
                completed certifications like "React - The Complete Guide" and
                "Javascript Advanced - Zero to Hero," showcasing my commitment
                to continuous learning. Known for maintaining clean code,
                delivering high-quality products on time, and creating engaging
                user interfaces, I welcome opportunities, collaborations, and
                discussions on front-end development.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default About;
