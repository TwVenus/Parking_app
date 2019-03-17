import { Area } from "./area.interface";

// Setting information
// --------------------------------------------------
// altVoiceControl -> Voice on/off
// distance -> Detection range
// language -> Voice language
// areas_List -> Parking Lot's detail information

export class Settings {
    altVoiceControl: boolean;
    distance: number;
    repeat: string;
    language: string;
    areas_List: Area[];
}