import { AutoPollConfiguration } from "./ConfigCatClientConfiguration";
import { ConfigCatClientImpl, IConfigCatClient } from "./ConfigCatClientImpl";
import { RolloutEvaluator, User } from "./RolloutEvaluator";
import { ProjectConfig } from "./ProjectConfigService";
import * as fs from "fs";
import * as readline from "readline";
import { ReadLine } from "readline";

const sample_v2: string = fs.readFileSync("tests/sample_v2.json", "utf8");
const CONFIG: ProjectConfig = new ProjectConfig(0, sample_v2, null);

class Startup {
    public static main2(): number {
        console.log("__DEBUG__");

        let evaluator: RolloutEvaluator = new RolloutEvaluator();

        let testmatrix: ReadLine = readline.createInterface({
            input: fs.createReadStream("tests/testmatrix.csv")
        });

        let header: string[];
        let rowNo: number = 1;

        testmatrix.on("line", line => {
            if (header) {

                let user: User = this.CreateUser(line, header);

                for (let i: number = 4; i < header.length; i++) {

                    let key: string = header[i];

                    let actual: any = evaluator.Evaluate(CONFIG, key, "N/A", user);

                    let expected: any = this.GetTypedValue(line.split(";")[i], key);

                    // tslint:disable-next-line:max-line-length
                    let l: string = <string><any>rowNo + ". (" + <string>key + ") " + <string><any>actual + " === " + <string><any>expected + " = " + <string><any>(actual === expected);

                    console.log(l);
                }

            } else {

                header = line.split(";");
            }

            rowNo++;
        });

        let user: User = new User("1234");

        evaluator.Evaluate(
            CONFIG
            , "stringDefaultCat",
            "NA", user);

        return 0;
    }

    private static CreateUser(row: string, headers: string[]): User {

        let up: string[] = row.split(";");

        if (up[0] === "##nouserobject##") {
            return null;
        }

        let result: User = new User(up[0]);

        result.Email = up[1];
        result.Country = up[2];
        result.Custom[headers[3]] = up[3];

        return result;
    }

    private static GetTypedValue(value: string, header: string): string | boolean | number {

        if (header.substring(0, "bool".length) === "bool") {
            return value.toLowerCase() === "true";
        }

        if (header.substring(0, "double".length) === "double") {
            return +value;
        }

        if (header.substring(0, "integer".length) === "integer") {
            return +value;
        }

        return value;
    }
}

Startup.main2();