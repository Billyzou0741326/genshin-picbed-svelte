import { writable } from 'svelte/store';

export const googleSignedIn = writable(false);
export const googleProfileImage = writable('');
export const googleEmail = writable('');
