// Parking Lot's space information (Data come from API)
// --------------------------------------------------
// Area -> parking lot's name
// CurrentQuantity -> parking lot's space
// UpdateDatetime -> DB updateDatetime

export interface ParkingLot {
    Area: string;
    CurrentQuantity: number;
    Latitude: number;
    Longitude: number;
    Light: String;
    UpdateDatetime: string;
}