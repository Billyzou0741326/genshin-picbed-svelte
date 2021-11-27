export default {
    mysql: {
        host: process.env['MYSQL_HOST'] || '127.0.0.1',
        port: parseInt(process.env['MYSQL_PORT']) || 3306,
        user: process.env['MYSQL_USER'] || '',
        password: process.env['MYSQL_PASSWORD'] || '',
        database: process.env['MYSQL_DATABASE'] || '',
    },
    mongodb: {
        url: process.env['MONGODB_URL'] || 'mongodb://127.0.0.1:27017/authSource=admin',
    },
    pixiv: {
        cookie: process.env['PIXIV_COOKIE'] || '',
    },
    api: {
        host: process.env['API_HOST'] || '',                            // leave blank if served from the same domain
        noHttps: process.env['API_NO_HTTPS'] === 'true' || false,       // only applied if `host` is not blank
    },
    image: {
        host: process.env['IMAGE_HOST'] || '',                          // leave blank if served from the same domain
        noHttps: process.env['IMAGE_USE_SSL'] === 'true' || false,      // only applied if `host` is not blank
    },
    nsfw_endpoint: process.env['NSFW_ENDPOINT'] || '',
    google: {
        client_id: process.env['GOOGLE_CLIENT_ID'] || '',
        client_secret: process.env['GOOGLE_CLIENT_SECRET'] || '',
        redirect_url: process.env['GOOGLE_REDIRECT_URL'] || '',
        api_key: process.env['GOOGLE_API_KEY'] || '',
    },
    db_sync_token: process.env['DB_SYNC_TOKEN'] || '349iwrojg-3=-tq',
};
