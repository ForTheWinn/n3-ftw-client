import React from "react";
import Modal from "../../../../../components/Modal";
import { Steps, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ITokenState } from "../../Swap/interfaces";

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
  txid?: `0x${string}`;
  explorer?: string;
  onClose: () => void;
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
                    {isTokenAApproving ? "Approving" : ""}
                    {isTokenAApproved ? "Approved" : ""}
                  </>
                ),
              },
              {
                title: tokenB.symbol,
                description: (
                  <>
                    {isTokenBApproving ? "Approving" : ""}
                    {isTokenBApproved ? "Approved" : ""}
                  </>
                ),
              },
              {
                title: "Action",
                description: (
                  <>
                    {isSwapping ? "Submitting" : ""}
                    {isSwapDone ? "Finished" : ""}
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
      </div>
    </Modal>
  );
};

export default ActionModal;
