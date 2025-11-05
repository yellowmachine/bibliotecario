import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from '$app/environment'
import { sequence } from '@sveltejs/kit/hooks';


const authHandle: Handle = async ({ event, resolve }) => {
	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
	  headers: event.request.headers,
	});
	// Make session and user available on server
	if (session) {
	  event.locals.session = session.session;
	  event.locals.user = session.user;
	}

    //const url = event.url.pathname;
	//const isAuthenticated = !!event.locals.user;

	//if (!isAuthenticated && url !== '/' && url !== '/login') {
	//	throw redirect(303, '/login'); // ← redirige a home
	//}

	return svelteKitHandler({ event, resolve, auth, building });
  }

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = sequence(handleParaglide, authHandle);
