import React from "react";

const PageLayout = (props) => {
  return (
    <section className="section">
      <div className="container">{props.children}</div>
    </section>
  );
};

export default PageLayout;
