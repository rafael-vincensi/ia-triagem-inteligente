import "./Modal.css";

export default function Modal({
    open,
    onClose,
    children,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <button
                    className="modal-close"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}