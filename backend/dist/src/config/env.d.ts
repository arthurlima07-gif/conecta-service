export declare function validateEnv(input: Record<string, unknown>): {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    SWAGGER_ENABLED: boolean;
    DATABASE_URL: string;
    CORS_ORIGINS: string[];
};
