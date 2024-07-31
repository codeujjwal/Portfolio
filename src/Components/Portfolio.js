import React, { Component } from "react";

class Portfolio extends Component {
  render() {
    if (this.props.data) {
      var projects = this.props.data.projects.map(function (projects) {
        var projectImage = "images/portfolio/" + projects.image;
        return (
          <div
            key={projects.title}
            className="portfolio-item-card"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <div className="item-wrap">
              <a
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                href={projects.url}
                title={projects.title}
                target="_blank"
              >
                <img alt={projects.title} src={projectImage} />
                <div className="portfolio-item-meta">
                  <p>{projects.category}</p>
                </div>
              </a>
            </div>
          </div>
        );
      });
    }

    return (
      <section id="portfolio">
        <div className="portfolio">
          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            Some projects i have worked or working on
          </h1>
          <div
            id="portfolio-wrapper"
            className="bgrid-quarters s-bgrid-thirds cf columnmm"
          >
            {projects}
          </div>
        </div>
        <div
          style={{
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            className="more-projects"
            onClick={() => {
              const link = "https://github.com/codeujjwal";
              window.open(link, "_blank");
            }}
          >
            View more projects
          </button>
        </div>
      </section>
    );
  }
}

export default Portfolio;
