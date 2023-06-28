import React from "react";

const CubeLoading = (props) => {
  return (
    <div className="has-text-centered">
      <img src={"/loading.gif"} alt="FTW loading" />
      <h1 className="title is-5">IN PROGRESS</h1>
      <p className="subtitle is-7">
        Please hold while your transaction is being confirmed
      </p>
    </div>
  );
};

export default CubeLoading;
