import React, { ReactElement } from "react";

interface IProps {
  onClose: () => void;
  children: ReactElement;
  isLoading?: boolean;
  error?: string;
  isLarge?: boolean;
}
const ModalCard = ({
  onClose,
  children,
  isLoading,
  error,
  isLarge
}: IProps) => {
  return (
    <div
      className={`modal is-active ${isLarge ? "is-large" : ""}`}
      style={{ zIndex: 99 }}
    >
      <div className="modal-background" onClick={onClose} />
      <section className="modal-content">
        <div className="box">
          {isLoading ? <div>Loading</div> : error ? <div>Error</div> : children}
        </div>
      </section>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      />
    </div>
  );
};

export default ModalCard;
