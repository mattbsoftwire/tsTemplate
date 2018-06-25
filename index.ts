import { Template } from './workspace/template'
import {ExpressAPI} from "./workspace/ExpressAPI";

export class Index {
    public static main(): number {
        new ExpressAPI().hostAPI();

        return 0;
    }
}

Index.main();