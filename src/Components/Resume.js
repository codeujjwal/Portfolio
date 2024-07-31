import React, { Component } from "react";

class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: 0, // Initialize with the first company selected by default
    };
  }

  handleCompanyClick = (index) => {
    this.setState({ selectedCompany: index });
  };

  render() {
    if (this.props.data) {
      var workDescriptions = this.props.data.work.map((work, index) => {
        return (
          <div
            key={work.company}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            style={{
              display: this.state.selectedCompany === index ? "block" : "none",
            }}
          >
            <span className="title">{work.title}</span>
            <p className="description">{work.description}</p>
            <span className="duration">Worked here for {work.duration}</span>
          </div>
        );
      });

      var companyNames = this.props.data.work.map((work, index) => {
        return (
          <h1
            key={work.company}
            onClick={() => this.handleCompanyClick(index)}
            style={{ cursor: "pointer" }}
          >
            <span
              style={{
                backgroundColor:
                  index === this.state.selectedCompany ? "#7510f738" : "#fff",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {work.company}
            </span>
          </h1>
        );
      });
    }

    return (
      <section id="resume">
        <h2>Experience</h2>
        <div className="row work">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <div className="resume-row">
              <div style={{ flex: 1 }}>{companyNames}</div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {workDescriptions}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Resume;
