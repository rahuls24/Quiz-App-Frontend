import useDocumentTitle from '@CustomHook/useDocumentTitle';
import { selectUserDetails, setUserDetails } from '@Feature/auth/authSlice';
import ExamineeHomePage from '@Feature/examinee/ExamineeHomePage';
import ExaminerHomePage from '@Feature/examiner/ExaminerHomePage';
import { useGetUserDetailsQuery } from '@ReduxStore/apis/apiSlice';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import Header from '@SharedComponent/Header';
import { compose } from 'ramda';
import { useEffect } from 'react';

function HomePage() {
    // Change Document Tile
    useDocumentTitle('Quiz App | Homepage');
    const { role: currentUserRole = 'examinee' } =
        useAppSelector(selectUserDetails) ?? {};
    const dispatch = useAppDispatch();
    const { data: userDetails, isSuccess } = useGetUserDetailsQuery('');
    useEffect(() => {
        if (isSuccess) {
            compose(dispatch, setUserDetails)(userDetails?.user);
        }
    }, [isSuccess, dispatch, userDetails]);
    console.log('Home page is called');
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
