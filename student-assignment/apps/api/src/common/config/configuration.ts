import * as fs from 'fs';

export default () => {
    const config: Record<string, any> = {};

    // Helper to read secret from file
    const readSecret = (envVar: string): string | undefined => {
        const secretPath = process.env[envVar];
        if (secretPath && fs.existsSync(secretPath)) {
            try {
                return fs.readFileSync(secretPath, 'utf8').trim();
            } catch (err) {
                console.error(`Failed to read secret from ${secretPath}`, err);
            }
        }
        return undefined;
    };

    // Database
    config.database = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: readSecret('DB_PASSWORD_FILE') || process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'pos_db',
    };

    // AWS
    config.aws = {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    // Security
    config.jwt = {
        secret: readSecret('JWT_SECRET_FILE') || process.env.JWT_SECRET || 'supersecretkey',
    };

    return config;
};
