// Parking Lot's detail information
// --------------------------------------------------
// Area -> parking lot's name
// postion_lat / postion_long -> parking lot's
// check -> Whether to tell the information

export interface Area {
    area: string;
    postion_lat: number;
    postion_long: number;
    check: boolean;
}