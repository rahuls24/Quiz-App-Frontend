// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
	// The cache reducer expects to be added at `state.api` (already default - this is optional)
	reducerPath: 'api',
	// All of our requests will have URLs starting with '/fakeApi'
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
	// The "endpoints" represent operations and requests for this server
	endpoints: builder => ({
		signupUser: builder.mutation({
			query: initialPost => ({
				url: '/auth/register-user-email',
				method: 'POST',
				// Include the entire post object as the body of the request
				body: initialPost,
			}),
		}),
		signinUser: builder.mutation({
			query: initialPost => ({
				url: '/auth/signin-user-email',
				method: 'POST',
				// Include the entire post object as the body of the request
				body: initialPost,
			}),
		}),
	}),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useSignupUserMutation, useSigninUserMutation } = apiSlice;
