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
			return headers;
		},
	}),
	tagTypes: ['User', 'Quiz'],
	// The "endpoints" represent operations and requests for this server
	endpoints: builder => ({
		signupUser: builder.mutation({
			query: userDetails => ({
				url: '/auth/register-user-with-email',
				method: 'POST',
				body: userDetails,
			}),
		}),
		signinUser: builder.mutation({
			query: userDetails => ({
				url: '/auth/signin-user-with-email',
				method: 'POST',
				body: userDetails,
			}),
			invalidatesTags: ['User'],
		}),
		getUserDetails: builder.query({
			query: () => ({
				url: '/auth/get-user-details',
			}),
			providesTags: ['User'],
		}),
		getAllEnrolledCourses: builder.query({
			query: () => ({
				url: '/quiz/get-all-enrolled-quizzes',
			}),
			providesTags: ['User', 'Quiz'],
		}),
		getAllUnenrolledCourses: builder.query({
			query: () => ({
				url: '/quiz/get-all-unenrolled-quizzes',
			}),
			providesTags: ['User', 'Quiz'],
		}),
		enrollForAQuiz: builder.mutation({
			query: quizId => ({
				url: '/quiz/enroll-for-a-quiz',
				method: 'POST',
				body: quizId,
			}),
			invalidatesTags: ['Quiz'],
		}),
	}),
});

export const {
	useSignupUserMutation,
	useSigninUserMutation,
	useGetUserDetailsQuery,
	useGetAllUnenrolledCoursesQuery,
	useGetAllEnrolledCoursesQuery,
	useEnrollForAQuizMutation,
} = apiSlice;
