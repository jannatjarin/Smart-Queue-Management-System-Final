"use client";

export default function Error(
    {
        reset
    }: {
        error: Error & {
            digest?: string
        },
        reset: () => void
    }
) {

    return (
        <div className="min-h-[70vh] flex items-center justify-center">

            <div className="card bg-base-100 shadow-xl w-full max-w-md">

                <div className="card-body text-center">

                    <h1 className="text-2xl font-bold">
                        Something went wrong
                    </h1>

                    <p>
                        An unexpected error occurred.
                    </p>

                    <button
                        onClick={
                            () => reset()
                        }
                        className="btn btn-primary mt-4"
                    >
                        Try Again
                    </button>

                </div>

            </div>

        </div>
    );
}