export interface IConfigCatLogger {
    log(message: string): void;
    error(message: string): void;
}

export class ConfigCatConsoleLogger implements IConfigCatLogger {
    log(message: string): void {
        console.log('ConfigCat log: ' + message);
    }
    
    error(message: string): void {
        console.error('ConfigCat log: ' + message);
    }
}