import config from '$lib/config';

export async function get() {
    return {
        body: {
            api_key: config.google.api_key,
            client_id: config.google.client_id,
        },
    };
}
