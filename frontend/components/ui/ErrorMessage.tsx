interface ErrorMessageProps {
    message: string
}

export default function ErrorMessage(
    { message }: ErrorMessageProps
) {

    return (
        <div className="alert alert-error">

            <span>
                {message}
            </span>

        </div>
    );
}