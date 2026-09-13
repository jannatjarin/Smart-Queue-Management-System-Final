export default function Footer() {

    return (
        <footer
            className="
                mt-auto
                border-t
                border-[#e8e1ef]
                bg-[#fffafd]/75
                backdrop-blur-md
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    max-w-7xl
                    flex-col
                    gap-3
                    px-5
                    py-7
                    text-center
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:text-left
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        gap-3
                        sm:justify-start
                    "
                >

                    <span
                        className="
                            h-3
                            w-3
                            rounded-full
                            bg-[#cfc4ff]
                        "
                    />


                    <div>

                        <p
                            className="
                                font-bold
                                text-[#454154]
                            "
                        >
                            Smart Queue Management System
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-sm
                                text-[#858093]
                            "
                        >
                            Less confusion. More calm while you wait.
                        </p>

                    </div>

                </div>


                <p
                    className="
                        text-sm
                        font-medium
                        text-[#8e899a]
                    "
                >
                    Advanced Web Technology Project
                </p>

            </div>

        </footer>
    );

}