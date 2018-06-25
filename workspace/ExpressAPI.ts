import * as express from 'express'
import {Arrival, Stop, TfLAPI} from "./TfLAPI";
import {Location, PostcodesAPI} from "./PostcodesAPI";
import {Request, Response} from "express";

export class ExpressAPI{
    private tflAPI: TfLAPI = new TfLAPI();
    private postcodesAPI: PostcodesAPI = new PostcodesAPI();
    private static takeFirstFiveForEach = stopArrivals => stopArrivals.map(arrivals => arrivals.slice(0, 5));
    private static RADIUS_INCREASE_STEP : number = 100;

    public hostWebsite() {
        const app = express();

        app.use(express.static(__dirname + '/resources'));

        app.get('/', (req: Request, res: Response) => res.sendFile(__dirname + '/index.html'));
        app.get('/closestStops', this.sendBusTimeResponse);

        app.listen(3000, () => console.log('Example app listening on port 3000!'))
    }

    private sendBusTimeResponse = (req, res) => {
        // Sanitise the request
        if (!req.hasOwnProperty("query")) {
            res.send(this.createErrorMessage("Invalid request"));
            return;
        }

        const postcode = req.query.postcode;

        this.getBusTimes(postcode)
            .then(JSON.stringify)
            .catch(error => this.createErrorMessage(error.message))
            .then(msg => {
                console.log(msg);
                return msg;
            })
            .then(message => res.send(message));
    }

    private getNextFiveArrivalsForPostCode(postcode: string) : Promise<Arrival[][]> {
        return this.postcodesAPI.getLongLatFromPostcode(postcode)
            .then(location => this.getClosestTwoStops(location))
            .then(list => Promise.all(
                list.map(stop => this.tflAPI.getNextArrivalsAtStop(stop.naptanId))
            ))
            .then(ExpressAPI.takeFirstFiveForEach);
    }

    private getClosestTwoStops(location: Location, radius: number = 200) : Promise<Stop[]> {
        return this.tflAPI.getNearestStopIDsToLocation(location, radius)
            //increase radius until at least 2 stops found
            .then(stopList => {
                if (stopList.length < 2) {
                    return this.getClosestTwoStops(location, radius + ExpressAPI.RADIUS_INCREASE_STEP);
                } else {
                    return stopList.slice(0, 2);
                }
            });

    }

    private createErrorMessage(message: string): string {
        return JSON.stringify({
            "error": message
        });
    }

    private getBusTimes = (postcode: string): Promise<Arrival[][]> => {
        return this.postcodesAPI.isValidLondonPostcode(postcode)
            .then(valid => {
                if (!valid) {
                    throw new Error("Postcode not in London");
                }
            })
            .then(() => this.getNextFiveArrivalsForPostCode(postcode))
    }




}