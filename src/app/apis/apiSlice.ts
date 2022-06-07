// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define our single API slice object
export const apiSlice = createApi({
	// The cache reducer expects to be added at `state.api` (already default - this is optional)
	reducerPath: 'api',
	// All of our requests will have URLs starting with '/fakeApi'
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:8000/api',
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				headers.set('authorization', String(token));				
			}
			// console.log("pant",headers)
			return headers;
		},
	}),
	tagTypes: ['User'],
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
			invalidatesTags: ['User'],
		}),
		getUserDetails: builder.query({
			query: () => ({
				url: '/auth/get-user-details',
			}),
			providesTags: ['User'],
		}),
	}),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
	useSignupUserMutation,
	useSigninUserMutation,
	useGetUserDetailsQuery,
} = apiSlice;
