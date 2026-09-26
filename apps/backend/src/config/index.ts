import dotenv from "dotenv"
dotenv.config()

export type IConfig = {
    nodeEnv: string
    jwtSecret: string
    port: number
    dbUrl: string
    redisUrl: string
}

export default class LoadConfig {
    private NODE_ENV: string
    private JWT_SECRET: string
    private PORT: number
    private DB_URL: string
    private REDIS_URL: string

    constructor(){
        this.DB_URL = process.env.DB_URL || ""
        this.JWT_SECRET = process.env.JWT_SECRET || ""
        this.NODE_ENV = process.env.NODE_ENV || "development"
        this.PORT = Number(process.env.PORT) || 8080
        this.REDIS_URL = process.env.REDIS_URL || ""
    }

    public getConfig(): IConfig {
        return {
            nodeEnv: this.NODE_ENV,
            port: this.PORT,
            dbUrl: this.DB_URL,
            jwtSecret: this.JWT_SECRET,
            redisUrl: this.REDIS_URL
        }
    }
}