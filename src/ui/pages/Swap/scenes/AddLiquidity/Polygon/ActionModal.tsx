import React from "react";
import Modal from "../../../../../components/Modal";
import { Steps } from "antd";
import { ITokenState } from "../../Swap/interfaces";
import LoadingWithText from "../../../../../components/Commons/LoadingWithText";

interface IActionModalProps {
  title: string;
  tokenA: ITokenState;
  tokenB: ITokenState;
  isTokenAApproved: boolean;
  isTokenBApproved: boolean;
  isSwapDone: boolean;
  isTokenAApproving: boolean;
  isTokenBApproving: boolean;
  isSwapping: boolean;
  hasTokenAError: boolean;
  hasTokenBError: boolean;
  hasSubmitError: boolean;
  txid?: `0x${string}`;
  explorer?: string;
  onClose: () => void;
}

const ActionModal = ({
  title,
  tokenA,
  tokenB,
  isTokenAApproved,
  isTokenBApproved,
  isSwapDone,
  isTokenAApproving,
  isTokenBApproving,
  isSwapping,
  hasTokenAError,
  hasTokenBError,
  hasSubmitError,
  txid,
  explorer,
  onClose,
}: IActionModalProps) => {
  let currentStep = 0;
  if (isTokenAApproved) {
    currentStep = 1;
  }
  if (isTokenBApproved) {
    currentStep = 2;
  }
  return (
    <Modal onClose={onClose}>
      <div className="">
        <div className="block">
          <h3 className="title is-5 has-text-centered">{title}</h3>
        </div>
        <div className="block">
          <Steps
            progressDot={true}
            current={currentStep}
            items={[
              {
                title: tokenA.symbol,
                description: (
                  <>
                    {isTokenAApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isTokenAApproved ? "Approved" : ""}
                    {hasTokenAError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                ),
              },
              {
                title: tokenB.symbol,
                description: (
                  <>
                    {isTokenBApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isTokenBApproved ? "Approved" : ""}
                    {hasTokenBError ? (
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
                    {isSwapping ? (
                      <LoadingWithText title="Submitting" />
                    ) : (
                      <></>
                    )}
                    {isSwapDone ? "Finished" : ""}
                    {hasSubmitError ? (
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

        {txid && isSwapDone ? (
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

        {hasSubmitError || hasTokenAError || hasTokenBError ? (
          <div className="has-text-centered">
            <hr />

            <button onClick={onClose} className="button is-black">
              Close
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};

export default ActionModal;
