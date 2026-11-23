function Modal({ title, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{title}</h2>

        {children}
        
      </div>
    </div>
  );
}

export default Modal;