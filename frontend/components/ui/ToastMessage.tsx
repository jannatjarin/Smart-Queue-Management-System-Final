interface ToastMessageProps {
    message: string;
    type:
        | "success"
        | "error";
}

export default function ToastMessage({
    message,
    type,
}: ToastMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <div className="toast toast-top toast-end z-50">
            <div
                className={
                    type === "success"
                        ? "rounded-[16px] border border-[#b6ceb2] bg-[#dcebd8] px-5 py-3 text-sm font-bold text-[#416343] shadow-md"
                        : "rounded-[16px] border border-[#dfb4b7] bg-[#f4d5d7] px-5 py-3 text-sm font-bold text-[#82464b] shadow-md"
                }
            >
                {message}
            </div>
        </div>
    );
}