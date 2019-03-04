import { ParkingLot } from './../models/parkinglot.interface';

export class ParkingLotService {
    private ParkingLots_List: ParkingLot[] = [];

    // addParkingLotToList + removeParkingLotFromList => update 
    addParkingLotToList(parkinglot: ParkingLot) {
        this.removeParkingLotFromList(parkinglot);
        this.ParkingLots_List.push(parkinglot);
    }

    removeParkingLotFromList(parkinglot: ParkingLot) {
        const postion = this.ParkingLots_List.findIndex((parkinglotEl: ParkingLot) => {
            return parkinglotEl.Area == parkinglot.Area;
        });

        if (postion != -1)
            this.ParkingLots_List.splice(postion, 1);
    }

    getParkingLotList() {
        return this.ParkingLots_List.slice();
    }
}