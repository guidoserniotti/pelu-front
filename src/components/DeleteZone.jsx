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
            // Prevenir scroll mientras se arrastra
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
            className="delete-zone-overlay"
        >
            <div className="delete-zone-content">
                <div className="delete-zone-icon">🗑️</div>
                <p className="delete-zone-text">Suelta aquí para eliminar</p>
            </div>
        </div>
    );
}

export default DeleteZone;
