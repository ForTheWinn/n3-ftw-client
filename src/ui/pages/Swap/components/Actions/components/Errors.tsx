import React from "react";

interface IErrorsProps {
  errorMessages: string;
  onClose: () => void;
}
const Errors = ({ errorMessages, onClose }: IErrorsProps) => {
  return (
    <>
      <div className="message is-danger" style={{ wordBreak: "break-word" }}>
        {errorMessages}
      </div>
      <button onClick={onClose} className="button is-black">
        Close
      </button>
    </>
  );
};

export default Errors;
