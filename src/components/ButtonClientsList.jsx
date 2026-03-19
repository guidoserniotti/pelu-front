const variantStyles = {
    "btn-edit": "hover:bg-accent/20",
    "btn-delete": "hover:bg-danger/15",
    "btn-add": "hover:bg-accent/20",
    "btn-logout": "hover:bg-danger/15",
};

const ButtonClientsList = ({ text, functionOnClick, imgSource, className }) => {
    const variant = variantStyles[className] || "hover:bg-accent/20";

    return (
        <button
            onClick={functionOnClick}
            className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent transition-all duration-200 active:scale-95 ${variant} max-lg:h-10 max-lg:w-10 max-md:h-9 max-md:w-9 max-sm:h-8 max-sm:w-8`}
            aria-label={text}
            title={text}
        >
            <img
                src={imgSource}
                alt={text}
                className="h-6 w-6 opacity-90 transition-opacity hover:opacity-100 max-md:h-5 max-md:w-5 max-sm:h-[18px] max-sm:w-[18px]"
            />
        </button>
    );
};

export default ButtonClientsList;
