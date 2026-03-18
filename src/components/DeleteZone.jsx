import { useEffect, useRef } from "react";

function DeleteZone({ isVisible }) {
    const deleteZoneRef = useRef(null);

    useEffect(() => {
        if (!deleteZoneRef.current) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = "move";
            }
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
        };

        const deleteZone = deleteZoneRef.current;
        deleteZone.addEventListener("dragover", handleDragOver);
        deleteZone.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });

        return () => {
            deleteZone.removeEventListener("dragover", handleDragOver);
            deleteZone.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            ref={deleteZoneRef}
            id="delete-zone"
            className="absolute inset-0 z-10 flex animate-[pulse-delete_1.5s_ease-in-out_infinite] items-center justify-center rounded-lg border-2 border-dashed border-white/40 bg-gradient-to-br from-danger/92 to-danger/95 shadow-[0_0_40px_rgba(239,68,68,0.6),inset_0_0_60px_rgba(0,0,0,0.3)]"
        >
            <div className="pointer-events-none text-center text-white">
                <div className="mb-4 animate-bounce text-7xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                    🗑️
                </div>
                <p className="m-0 font-title text-2xl font-bold tracking-wide [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
                    Suelta aqui para eliminar
                </p>
            </div>
        </div>
    );
}

export default DeleteZone;
