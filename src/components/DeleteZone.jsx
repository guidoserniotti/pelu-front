import { useEffect, useRef } from "react";

function DeleteZone({ isVisible }) {
    const deleteZoneRef = useRef(null);

    useEffect(() => {
        if (!deleteZoneRef.current) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        };

        const deleteZone = deleteZoneRef.current;
        deleteZone.addEventListener("dragover", handleDragOver);

        return () => {
            deleteZone.removeEventListener("dragover", handleDragOver);
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
