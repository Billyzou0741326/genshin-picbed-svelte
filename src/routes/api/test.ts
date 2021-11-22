export function get({ locals }) {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: {
            ...locals,
        },
    };
}
