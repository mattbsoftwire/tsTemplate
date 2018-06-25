import {ExpressAPI} from "./workspace/ExpressAPI";

export class Index {
    public static main(): number {
        new ExpressAPI().hostWebsite();

        return 0;
    }
}

Index.main();