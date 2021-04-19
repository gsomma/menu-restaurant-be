import { Inject, LoggerService, Injectable } from "@nestjs/common";
import { getLogger, Logger, shutdown, configure, Configuration } from "log4js";

import { resolve, join } from "path";
const basePath = resolve(process.cwd(), "logs");

const LOG4JS_OPTION = Symbol("LOG4JS_OPTION")

@Injectable()
export class Log4jsService implements LoggerService {
    private loggers: Map<string, Logger> = new Map();
    constructor(@Inject(LOG4JS_OPTION) options?: Configuration | string) {
        // this.loggers = new Map();
        // if (typeof options == "string") {
        //     options = this.buildDefaultConfig(options);
        // } else if (typeof options == "undefined") {
        //     options = this.buildDefaultConfig("all");
        // }
        //configure(options);
        // Logger configuration
        configure('log4js-config.json');
    }

    getLogger(loggerName = "APP"):Logger {
        let logger = this.loggers.get(loggerName);
        if (!logger) {
            logger = getLogger(loggerName);
            this.loggers.set(loggerName, logger);
        }
        // if (logger.category=='ComuniService'){
        //     console.log('logger=',logger);
        //     console.log('logger.category='+logger.category);
        //     console.log('logger.level='+logger.level);
        //     console.log('logger.isDebugEnabled='+logger.isDebugEnabled());
        //     // console.log('logger.isErrorEnabled='+logger.isErrorEnabled());
        //     // console.log('logger.isFatalEnabled='+logger.isFatalEnabled());
        //     // console.log('logger.isInfoEnabled='+logger.isInfoEnabled());
        //     // console.log('logger.isTraceEnabled='+logger.isTraceEnabled());
        //     // console.log('logger.isWarnEnabled='+logger.isWarnEnabled());
        // }
        return logger;
    }

    log(message: any, context?: string) {
        this.getLogger(context).info(message);
    }

    error(message: any, trace?: string, context?: string) {
        this.getLogger(context).error(message, trace);
    }

    warn(message: any, context?: string) {
        this.getLogger(context).warn(message);
    }

    debug(message: any, context?: string) {
            // console.log('logger.debug='+context+"/"+message);
        this.getLogger(context).debug(message);
            // console.log(this);
        // this.getLogger().debug(context+" : "+message);
    }

    flushall(cb?: () => void) {
        shutdown(() => {
            cb && cb();
        });
    }
/*
    buildDefaultConfig(level: string): Configuration {
        return {
            appenders: {
                logToErrorFile: {
                    type: "dateFile",
                    filename: join(basePath, "err/err"),
                    alwaysIncludePattern: true,
                    pattern: "yyyy-MM-dd.log",
                    daysToKeep: 14
                },
                errorLogger: {
                    type: "logLevelFilter",
                    appender: "logToErrorFile",
                    level: "error"
                },
                appLogger: {
                    type: "dateFile",
                    filename: join(basePath, "all/all"),
                    alwaysIncludePattern: true,
                    pattern: "yyyy-MM-dd.log",
                    daysToKeep: 14
                },
                consoleLogger: {
                    type: "console",
                    layout: {
                        type: "colored"
                    }
                }
            },
            categories: {
                default: {
                    appenders: ["consoleLogger", "appLogger", "errorLogger"],
                    level: level
                }
            }
        };    
    }
*/    
}