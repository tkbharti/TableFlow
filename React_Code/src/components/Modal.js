import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ visible, title, children, onClose, onOk }) => {
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "auto";
  }, [visible]);

  return (
    <div
      className={`custom-modal-backdrop ${visible ? "show" : "hide"}`}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className={`custom-modal ${visible ? "fade-in" : "fade-out"}`}>
        <div className="custom-modal-header bg-teal text-white">
          <h5 className="m-0">{title}</h5>
        </div>
        <div className="custom-modal-body">{children}</div>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOk}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
