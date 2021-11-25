<script lang="ts">

    import { onMount } from 'svelte';
    import { googleSignedIn, googleProfileImage, googleEmail } from '$lib/stores/sync';

    export let apiKey: string;
    export let clientId: string;

    onMount(() => {
        try {
            const email = localStorage.getItem('google_email');
            const profile = localStorage.getItem('google_profile');

            if (email && profile) {
                console.log(`${email} - ${profile}`);
                googleSignedIn.set(true);
                googleEmail.set(email);
                googleProfileImage.set(profile);
            }
        } catch (error) {}
        appendScript();
    });

    function appendScript() {
        if (apiKey === '' || clientId === '') {
            console.log(`apiKey and clientId not ready`);
            return;
        }
        const element = document.getElementById('gapi');
        if (element && gapi && gapi.auth2 && gapi.client) {
            console.log(`gapi loaded`);
            return;
        }
        if (element) {
            element.parentElement.removeChild(element);
        }
        const script = document.createElement('script');
        script.onload = startSync;
        script.onerror = (error) => console.log(error);
        script.src = 'https://apis.google.com/js/api.js';
        script.id = 'gapi';
        document.body.appendChild(script);
    }

    function startSync() {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                'apiKey': apiKey,
                'clientId': clientId,
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                'scope': [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/drive.appdata',
                ].join(' '),
            }).then(() => {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                gapi.auth2.getAuthInstance().currentUser.listen(updateProfile);
                updateProfile(gapi.auth2.getAuthInstance().currentUser.get());
            }, (error) => {
                console.error(error);
                updateSigninStatus(false);
            });
        });
    }

    function updateSigninStatus(status) {
        googleSignedIn.set(status);
        if (!status) {
            localStorage.setItem('google_profile', '');
            localStorage.setItem('google_email', '');
        }
    }

    function updateProfile(googleUser) {
        if (!googleUser) {
            googleProfileImage.set('');
            googleEmail.set('');
            localStorage.setItem('google_profile', '');
            localStorage.setItem('google_email', '');
            return;
        }
        const googleProfile = googleUser.getBasicProfile();
        if (!googleProfile) {
            googleProfileImage.set('');
            googleEmail.set('');
            localStorage.setItem('google_profile', '');
            localStorage.setItem('google_email', '');
            return;
        }
        const profileImage = googleProfile.getImageUrl();
        const email = googleProfile.getEmail();
        googleProfileImage.set(profileImage);
        googleEmail.set(email);
        localStorage.setItem('google_profile', profileImage);
        localStorage.setItem('google_email', email);
    }
</script>

<slot />
