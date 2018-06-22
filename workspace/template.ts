import {ExpressAPI} from "./ExpressAPI";

export class Template {
    public run(): void {
        new ExpressAPI().hostAPI();
    }
}

