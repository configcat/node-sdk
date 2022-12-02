import { IConfigCatLogger, LogLevel } from "../../src/client";

export class FakeLogger implements IConfigCatLogger {
    public messages: [LogLevel, string][] = [];

    constructor(public level = LogLevel.Info) { }

    reset() { this.messages.splice(0); }

    log(message: string): void {
        this.info(message);
    }

    debug(message: string): void {
        this.messages.push([LogLevel.Debug, message]);
    }

    info(message: string): void {
        this.messages.push([LogLevel.Info, message]);
    }

    warn(message: string): void {
        this.messages.push([LogLevel.Warn, message]);
    }

    error(message: string): void {
        this.messages.push([LogLevel.Error, message]);
    }
}