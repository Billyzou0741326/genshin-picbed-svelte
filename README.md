## Deploying with Docker Compose

This is the recommended way to deploy the site.

### Run

```bash
docker-compose up -d
```

### Database migration

```bash
docker cp migration.sql <mysql_container_name>:/migration.sql
docker exec -it <mysql_container_name> bash
mysql -u <username> -p -- <database_name> < /migration.sql
exit
```


## About Svelte

New to svelte? Get started at the official site of [Svelte-kit](https://kit.svelte.dev/).

## Development

Once you've cloned this project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Config

Check `.env.example`. Copy it to `.env` and fill in your custom options

```bash
cp .env.example .env
```

Check `keys/README.md` for generating JWT keys.

## Build (Command line)

```bash
# Clean up
rm -r build/

# Build
npx svelte-kit build
```

Then check your `build/` folder. This is where the web app is served from.

## Run (Command line)

After building the project, run with one of the following commands:

```bash
node -r dotenv/config build/index.js
PORT=8080 node -r dotenv/config build/index.js
```

Choose a web server to your liking (nginx, apache, etc) for deployment.

## Test (Command line)

```bash
npm run test
```


## MySQL dependency

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
