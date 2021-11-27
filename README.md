## Deploying with Kubernetes

This is the recommended way to deploy the site.

## About Svelte

New to svelte? Get started at the official site of [Svelte-kit](https://kit.svelte.dev/).

## Config

Check `.env.example`. Copy it to `.env` and fill in your custom options

```bash
cp .env.example .env
```

## Build (Command line)

```bash
# Clean up
rm -r build/

# Build
npx svelte-kit build
```

Then check the `build/` folder. This is where the web app is served from.

## Run (Command line)

After building the project, run with one of the following commands:

```bash
node -r dotenv/config build/index.js
# Serve at anoter port
PORT=8080 node -r dotenv/config build/index.js
```

Choose a web server to your liking (nginx, apache, etc) for deployment.

## Test (Command line)

```bash
npm run test
```

## Mongodb dependency

The mongodb data is sychronized with the relational SQL database backing the [TGGenshinPicbed project](https://github.com/luoshuijs/TGGenshinPicBed_Bot). Data modifications are all done on that database and sychronized via a REST API. Refer to [src/routes/api/db/sync.ts](src/routes/api/db/sync.ts) for implementation details.

The main collection schema:

```json
{
        "_id" : ObjectId("61a005945c57670008c7a5ca"),
        "art_id" : 94314043,
        "title" : "申鶴さん",
        "tag_str" : "#原神#申鶴#原神5000users入り",
        "characters" : [
                "Shenhe"
        ],
        "view_count" : 26391,
        "like_count" : 6542,
        "love_count" : 10361,
        "artist_id" : 62635184,
        "upload_timestamp" : 1637614046,
        "is_404" : false,
        "images" : [
                {
                        "urls" : {
                                "thumb_mini" : "https://i.pximg.net/c/128x128/custom-thumb/img/2021/11/23/05/47/26/94314043_p0_custom1200.jpg",
                                "small" : "https://i.pximg.net/c/540x540_70/img-master/img/2021/11/23/05/47/26/94314043_p0_master1200.jpg",
                                "regular" : "https://i.pximg.net/img-master/img/2021/11/23/05/47/26/94314043_p0_master1200.jpg",
                                "original" : "https://i.pximg.net/img-original/img/2021/11/23/05/47/26/94314043_p0.png"
                        },
                        "nsfw" : {
                                "drawings" : 0.9658458828926086,
                                "hentai" : 0.03393279388546944,
                                "neutral" : 0.00015959740267135203,
                                "porn" : 0.00006085155109758489,
                                "sexy" : 9.48483375395881e-7
                        }
                }
        ],
        "moderate" : {
                "type" : "SFW",
                "status" : "PUSH",
                "reason" : ""
        }
}
```

## MySQL dependency

> Deprecated in favor of Mongodb

### Database migration

```bash
docker cp migration.sql <mysql_container_name>:/migration.sql
docker exec -it <mysql_container_name> bash
mysql -u <username> -p -- <database_name> < /migration.sql
exit
```

...On top of the tables used by the bot, these tables need to be added:

```sql
CREATE TABLE `pixiv_image_uri` (
    `art_id` bigint(11) unsigned NOT NULL,
    `uri_json` TEXT NOT NULL,
    UNIQUE (`art_id`),
    FOREIGN KEY (`art_id`) REFERENCES `genshin_pixiv` (`illusts_id`) ON DELETE CASCADE
);
```

```sql
CREATE TABLE `character_art` (
    art_id BIGINT(11) UNSIGNED NOT NULL,
    char_name VARCHAR(255) NOT NULL,
    UNIQUE (art_id, char_name),
    FOREIGN KEY (art_id) REFERENCES `genshin_pixiv`(illusts_id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE `web_user` (
    user_id BIGINT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(256) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    salt VARCHAR(256) NOT NULL,
    web_darkmode TINYINT DEFAULT 0 NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE (username)
);
```

```sql
CREATE TABLE `web_token` (
    user_id BIGINT(11) UNSIGNED NOT NULL,
    refresh_token VARCHAR(256) NOT NULL,
    expires_at BIGINT(20) UNSIGNED NOT NULL,
    previous_token VARCHAR(256) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (refresh_token),
    UNIQUE (user_id, refresh_token),
    FOREIGN KEY (user_id) REFERENCES `web_user` (user_id)
);
```

```sql
CREATE TABLE `art_nsfw` (
);
```
