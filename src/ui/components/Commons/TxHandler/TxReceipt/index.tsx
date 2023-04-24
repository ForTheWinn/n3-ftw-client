import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import CheckMark from "../../../../pages/Tournament/scenes/Arena/Players/components/CheckMark";
import CubeLoading from "./CubeLoading";

interface ITxReceiptProps {
  error?: string;
  txid: string;
  explorer: string;
  isSuccess: boolean;
  onError: () => void;
  onSuccess: () => void;
}
const style = {
  width: "300px",
  height: "300px",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
const TxReceipt = ({
  isSuccess,
  error,
  txid,
  onError,
  onSuccess,
  explorer
}: ITxReceiptProps) => {
  return (
    <>
      <div style={style}>
        {error ? (
          <FaExclamationCircle size={90} className="has-text-danger" />
        ) : isSuccess ? (
          <CheckMark />
        ) : (
          <CubeLoading />
        )}
      </div>
      <div className="has-background  has-text-centered mt-5">
        {error ? (
          <div style={{ marginTop: "-40px" }}>
            <h1 className="title is-5">Error occurred</h1>
            <p className="subtitle is-7">{error}</p>
            <button onClick={onError} className="button is-black">
              Close
            </button>
          </div>
        ) : isSuccess ? (
          <div style={{ marginTop: "-40px" }}>
            <h1 className="title is-5">Submitted</h1>
            <p className="subtitle is-7">Your transaction accepted</p>
            <div className="block">
              <a target="_blank" href={`${explorer}/${txid}`} rel="noreferrer">
                View txid on explorer
              </a>
            </div>
            <div className="block">
              <button onClick={onSuccess} className="button is-black">
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="title is-5">Submitting</h1>
            <p className="subtitle is-7">
              Please wait until your transaction accepted
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TxReceipt;
