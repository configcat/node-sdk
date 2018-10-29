import { assert } from "chai";
import "mocha";
import { RolloutEvaluator, User } from "../src/RolloutEvaluator";
import { ProjectConfig } from "../src/ProjectConfigService";
import * as fs from "fs";
import * as winston from "winston";

describe("MatrixTests", () => {

    const sample_v2: string = fs.readFileSync("tests/sample_v2.json", "utf8");
    const CONFIG: ProjectConfig = new ProjectConfig(0, sample_v2, null);
    const testmatrix: string[] = require("fs").readFileSync("tests/testmatrix.csv").toString().split("\r\n");

    var logger: winston.LoggerInstance = new winston.Logger({
        level: "info",
        transports: [
            new winston.transports.Console({ timestamp: true })
        ]});

    let evaluator: RolloutEvaluator = new RolloutEvaluator(logger);

    it("GetValue", (done) => {

        let header: string[];
        let rowNo: number = 1;

        testmatrix.forEach(function (line: string): void {

            // testmatrix.on("line", line => {

            if (header) {

                if (!line) {
                    return;
                }

                let user: User = Helper.CreateUser(line, header);

                for (let i: number = 4; i < header.length; i++) {

                    let key: string = header[i];

                    let actual: any = evaluator.Evaluate(CONFIG, key, Helper.GetTypedDefaultValue(key), user);

                    let expected: any = Helper.GetTypedValue(line.split(";")[i], key);

                    if (actual !== expected) {

                        // tslint:disable-next-line:max-line-length
                        let l: string = <string><any>rowNo + "." + " User -  " + user + "(" + <string>key + ") " + <string><any>actual + " === " + <string><any>expected + " = " + <string><any>(actual === expected);

                        console.log(l);
                    }

                    // assert
                    assert.strictEqual(actual, expected);
                    // console.log(actual);
                }

            } else {

                header = line.split(";");
            }

            rowNo++;
        });

        done();

    });

    class Helper {

        public static CreateUser(row: string, headers: string[]): User {

            let up: string[] = row.split(";");

            if (up[0] === "##nouserobject##") {
                return null;
            }

            let result: User = new User(up[0]);

            result.email = up[1];
            result.country = up[2];
            result.custom[headers[3]] = up[3];

            return result;
        }

        public static GetTypedValue(value: string, header: string): string | boolean | number {

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

        public static GetTypedDefaultValue(key: string): string | boolean | number {

            if (key.substring(0, "bool".length) === "bool") {
                return false;
            }

            if (key.substring(0, "double".length) === "double") {
                return -123.456;
            }

            if (key.substring(0, "integer".length) === "integer") {
                return 123;
            }

            return "N/A";
        }
    }
});