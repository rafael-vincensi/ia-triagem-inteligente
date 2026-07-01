import "./Toast.css";

export default function Toast({
    show,
    message,
    type = "success",
}) {
    if (!show) {
        return null;
    }

    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
}