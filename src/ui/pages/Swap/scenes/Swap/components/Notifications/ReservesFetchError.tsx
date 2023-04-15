import React from "react";

const ReservesFetchError = ({ message }) => {
  return (
    <>
      <hr />
      <div className="notification is-danger is-light">{message}</div>
    </>
  );
};

export default ReservesFetchError;
