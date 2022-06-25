import React from 'react';
import * as R from 'ramda';
import { setUserDetails, selectUserDetails } from '../features/auth/authSlice';
import { useGetUserDetailsQuery } from '../app/apis/apiSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Header from '../shared/components/Header';
import ExamineeHomePage from '../features/examinee/ExamineeHomePage';
import ExaminerHomePage from '../features/examiner/ExaminerHomePage';

function HomePage() {
	const { role: currentUserRole = 'examinee' } =
		useAppSelector(selectUserDetails) ?? {};
	const dispatch = useAppDispatch();
	const { data: userDetails, isSuccess } = useGetUserDetailsQuery('');
	React.useEffect(() => {
		if (isSuccess) {
			R.compose(dispatch, setUserDetails)(userDetails?.user);
		}
	}, [isSuccess, dispatch, userDetails]);
	return (
		<>
			<Header />
			{currentUserRole === 'examiner' ? (
				<ExaminerHomePage />
			) : (
				<ExamineeHomePage />
			)}
		</>
	);
}

export default HomePage;
