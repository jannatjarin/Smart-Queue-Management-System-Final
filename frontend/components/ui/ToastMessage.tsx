interface ToastMessageProps {

    message: string;

    type:
        "success" |
        "error";

}


export default function ToastMessage(
    {
        message,
        type,
    }: ToastMessageProps
) {

    if (!message) {

        return null;

    }


    return (
        <div className="toast toast-top toast-end z-50">

            <div
                className={
                    type == "success"
                        ? "alert alert-success"
                        : "alert alert-error"
                }
            >

                <span>
                    {message}
                </span>

            </div>

        </div>
    );

}