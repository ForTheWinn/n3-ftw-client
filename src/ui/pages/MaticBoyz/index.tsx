import React from "react";

const MaticBoyz = () => {
  return (
    <section className="hero is-white is-fullheight-with-navbar is-relative">
      <div className="hero-body">
        <div className="container">
          <div className="has-text-centered mb-6">
            <h1 className="title is-spaced is-size-4-mobile">Matic Boyz</h1>
            <p className="heading is-size-6-mobile">
              The coolest boyz on the polygon blocks
            </p>
            <p>-</p>

            <div>
              <img
                alt="Matic Boyz"
                width={150}
                src="/boyz/sample-matic-boy.png"
              />
              <br />
              <p className="heading is-size-6-mobile">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaticBoyz;
