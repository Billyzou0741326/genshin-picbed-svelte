export default {
    mysql: {
        host: process.env['MYSQL_HOST'] || '127.0.0.1',
        port: parseInt(process.env['MYSQL_PORT']) || 3306,
        user: process.env['MYSQL_USER'] || '',
        password: process.env['MYSQL_PASSWORD'] || '',
        database: process.env['MYSQL_DATABASE'] || '',
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
    jwt: {
        public_key: process.env['JWT_PUBLIC_KEY'] || '',
        private_key: process.env['JWT_PRIVATE_KEY'] || '',
    },
};
