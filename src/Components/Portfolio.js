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
              <a href={projects.url} title={projects.title}></a>
              <img alt={projects.title} src={projectImage} />
              <div className="portfolio-item-meta">
                <h5>{projects.title}</h5>
                <p>{projects.category}</p>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <section id="portfolio">
        <div className="row">
          <div className="twelve columns collapsed">
            <h1
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
            >
              Some of My Projects
            </h1>

            <div
              id="portfolio-wrapper"
              className="bgrid-quarters s-bgrid-thirds cf columnmm"
            >
              {projects}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Portfolio;
