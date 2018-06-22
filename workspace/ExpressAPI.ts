import * as express from 'express'
import {TfLAPI} from "./TfLAPI";
import {PostcodesAPI} from "./PostcodesAPI";

export class ExpressAPI{
    public static hostAPI() {
        const app = express()

        app.get('/closeststops', (req, res) => {
            const postcode = req.query.postcode;

            const tflAPI = new TfLAPI();
            const postcodesAPI = new PostcodesAPI();
            const takeFirstFiveForEach = stopArrivals => stopArrivals.map(arrivals => arrivals.slice(0, 5));

            postcodesAPI.getLongLatFromPostcode(postcode)
                .then(tflAPI.getNearestStopIDsToLocation)
                .then(list => Promise.all(
                    list.slice(0, 2)
                        .map(stop => tflAPI.getNextArrivalsAtStop(stop.naptanId))
                    )
                )
                .then(takeFirstFiveForEach)
                .then(response => res.send(JSON.stringify(response)));
        });
        app.listen(3000, () => console.log('Example app listening on port 3000!'))
    }
}