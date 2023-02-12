import React from "react";
import Modal from "../../../../../components/Modal";
import { Steps } from "antd";
import LoadingWithText from "../../../../../components/Commons/LoadingWithText";

interface IActionModalProps {
  isApproved: boolean;
  isApproving: boolean;
  approveError: boolean;
  isFinished: boolean;
  isRemoving: boolean;
  submitError: boolean;
  txid?: string;
  explorer?: string;
  onClose: () => void;
}

const RemoveLiquidityModal = ({
  isApproved,
  isApproving,
  approveError,
  isFinished,
  isRemoving,
  submitError,
  txid,
  explorer,
  onClose,
}: IActionModalProps) => {
  let currentStep = 0;
  if (isApproved) {
    currentStep = 1;
  }
  return (
    <Modal onClose={onClose}>
      <div className="">
        <div className="block">
          <h3 className="title is-5 has-text-centered">Remove liquidity</h3>
        </div>
        <div className="block">
          <Steps
            progressDot={true}
            current={currentStep}
            items={[
              {
                title: "Tranfsfer approval",
                description: (
                  <>
                    {isApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isApproved ? "Approved" : ""}
                    {approveError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                ),
              },
              {
                title: "Action",
                description: (
                  <>
                    {isRemoving ? (
                      <LoadingWithText title="Submitting" />
                    ) : (
                      <></>
                    )}
                    {isFinished ? "Finished" : ""}
                    {submitError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>

        {txid && isFinished ? (
          <>
            <hr />
            <div className="buttons" style={{ justifyContent: "center" }}>
              <a
                className="button is-primary"
                target="_blank"
                href={`${explorer}/tx/${txid}`}
                rel="noreferrer"
              >
                View txid on explorer
              </a>
              <button onClick={onClose} className="button is-black">
                Close
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};

export default RemoveLiquidityModal;
