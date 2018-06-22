import * as express from 'express'
import {Arrival, Stop, TfLAPI} from "./TfLAPI";
import {Location, PostcodesAPI} from "./PostcodesAPI";

export class ExpressAPI{
    private tflAPI = new TfLAPI();
    private postcodesAPI = new PostcodesAPI();
    private static takeFirstFiveForEach = stopArrivals => stopArrivals.map(arrivals => arrivals.slice(0, 5));
    private static RADIUS_INCREASE_STEP : number = 100;

    private getNextFiveArrivalsForPostCode(postcode: string) : Promise<Arrival[][]> {
        return this.postcodesAPI.getLongLatFromPostcode(postcode)
            .then(location => this.getClosestTwoStops(location))
            .then(list => Promise.all(
                list.slice(0, 2)
                    .map(stop => this.tflAPI.getNextArrivalsAtStop(stop.naptanId))
                )
            )
            .then(ExpressAPI.takeFirstFiveForEach);
    }

    private getClosestTwoStops(location: Location, radius: number = 200) : Promise<Stop[]> {
        return this.tflAPI.getNearestStopIDsToLocation(location, radius)
            .then(stopList => {
                if (stopList.length < 2) {
                    return this.getClosestTwoStops(location, radius + ExpressAPI.RADIUS_INCREASE_STEP);
                } else {
                    return stopList;
                }
            });

    }

    public hostAPI() {
        const app = express()

        app.get('/closeststops', (req, res) => {
            const postcode = req.query.postcode;

            this.getNextFiveArrivalsForPostCode(postcode)
                .then(response => res.send(JSON.stringify(response)));
        });
        app.listen(3000, () => console.log('Example app listening on port 3000!'))
    }
}