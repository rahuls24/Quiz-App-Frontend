import AllQuizView from '@Feature/quiz/examiner/quizView/AllQuizView';
import QuizDetailsView from '@Feature/quiz/QuizDetailsView';
import {
    selectIsQuizDetailsViewOpen,
    setIsQuizDetailsViewOpen,
} from '@Feature/quiz/QuizSlice';
import QuizView from '@Feature/quiz/QuizView';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    useGetAllEnrolledCoursesQuery,
    useGetAllUnenrolledCoursesQuery,
} from '@ReduxStore/apis/apiSlice';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import {compose} from 'ramda';
import {useEffect,useMemo,useState} from 'react';
import { useNavigate } from 'react-router-dom';
function ExaminerHomePage() {
    const navigate = useNavigate();
    const {
        data: { quizzes: myQuizzesList = [] } = {},
        isFetching: isMyQuizzesApiFetching,
        isError: isMyQuizzesHavingError,
        error: errorOfMyQuizzesApi,
        refetch: reFetchMyQuizzesList,
    } = useGetAllEnrolledCoursesQuery(null, {
        refetchOnReconnect: true,
    });
    const {
        data: { quizzes: allQuizListExcludedMyQuizzesList = [] } = {},
        isFetching: isAllQuizListExcludedMyQuizzesApiFetching,
        isError: isAllQuizListExcludedMyQuizzesHavingError,
        error: errorOfAllQuizListExcludedMyQuizzesApi,
        refetch: reFetchAllQuizListExcludedMyQuizzesList,
    } = useGetAllUnenrolledCoursesQuery(null, {
        refetchOnReconnect: true,
    });
    const [shouldShowReloadBtns, shouldShowReloadBtnsHandler] = useState({
        forMyQuizzesList: true,
        forAllQuizListExcludedMyQuizzesList: true,
    });

    useEffect(() => {
        if (
            !isMyQuizzesHavingError &&
            !isAllQuizListExcludedMyQuizzesHavingError
        )
            return;
        let shouldShowReloadBtnsInitialState = {
            forMyQuizzesList: true,
            forAllQuizListExcludedMyQuizzesList: true,
        };
        if (errorOfMyQuizzesApi && 'status' in errorOfMyQuizzesApi) {
            if (errorOfMyQuizzesApi.status === 500)
                shouldShowReloadBtnsInitialState.forMyQuizzesList = false;
        }
        if (
            errorOfAllQuizListExcludedMyQuizzesApi &&
            'status' in errorOfAllQuizListExcludedMyQuizzesApi
        ) {
            if (errorOfAllQuizListExcludedMyQuizzesApi.status === 500)
                shouldShowReloadBtnsInitialState.forAllQuizListExcludedMyQuizzesList =
                    false;
        }
        shouldShowReloadBtnsHandler(shouldShowReloadBtnsInitialState);
    }, [
        isMyQuizzesHavingError,
        errorOfMyQuizzesApi,
        isAllQuizListExcludedMyQuizzesHavingError,
        errorOfAllQuizListExcludedMyQuizzesApi,
        shouldShowReloadBtnsHandler,
    ]);

    useEffect(() => {
        reFetchMyQuizzesList();
        reFetchAllQuizListExcludedMyQuizzesList();
    }, [reFetchMyQuizzesList, reFetchAllQuizListExcludedMyQuizzesList]);
    const allQuizViewProps = useMemo(() => {
        return {
            isFetching: isAllQuizListExcludedMyQuizzesApiFetching,
            isError: isAllQuizListExcludedMyQuizzesHavingError,
            reFetchAllQuizList: reFetchAllQuizListExcludedMyQuizzesList,

            shouldShowReloadBtn:
                shouldShowReloadBtns.forAllQuizListExcludedMyQuizzesList,

            quizList: allQuizListExcludedMyQuizzesList,
        };
    }, [
        isAllQuizListExcludedMyQuizzesApiFetching,
        isAllQuizListExcludedMyQuizzesHavingError,
        reFetchAllQuizListExcludedMyQuizzesList,
        shouldShowReloadBtns.forAllQuizListExcludedMyQuizzesList,
        allQuizListExcludedMyQuizzesList,
    ]);
    const myQuizViewProps = useMemo(() => {
        return {
            isFetching: isMyQuizzesApiFetching,
            isError: isMyQuizzesHavingError,
            reFetchQuizList: reFetchMyQuizzesList,
            shouldShowReloadBtn: shouldShowReloadBtns.forMyQuizzesList,
            quizList: myQuizzesList,
            cardViewGridStyle: {
                xs: 4,
                md: 12,
            },
            headerTitle: 'My Quizzes',
            roleOfUser: 'examiner' as examinerRole,
        };
    }, [
        isMyQuizzesApiFetching,
        isMyQuizzesHavingError,
        reFetchMyQuizzesList,
        shouldShowReloadBtns.forMyQuizzesList,
        myQuizzesList,
    ]);

    // For Quiz Details
    const dispatch = useAppDispatch();
    const isQuizDetailsViewOpen = useAppSelector(selectIsQuizDetailsViewOpen);

    useEffect(() => {
        return () => {
            compose(dispatch, setIsQuizDetailsViewOpen)(false);
        };
    }, [dispatch]);
    return (
        <>
            <Grid
                container
                columns={{ xs: 4, md: 12 }}
                spacing={1}
                marginTop={1}
                paddingX={1}
            >
                <Grid item xs={4} md={5}>
                    <Paper
                        sx={{
                            minHeight: '85vh',
                        }}
                        elevation={3}
                    >
                        <QuizView {...myQuizViewProps} />
                    </Paper>
                </Grid>
                <Grid item xs={4} md={7}>
                    <Paper
                        sx={{
                            minHeight: '85vh',
                        }}
                        elevation={3}
                        className={'scroll'}
                    >
                        {!isQuizDetailsViewOpen && (
                            <>
                                <AllQuizView {...allQuizViewProps} />
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                    sx={{
                                        margin: 0,
                                        right: 20,
                                        bottom: 20,
                                        position: 'fixed',
                                    }}
                                    onClick={() =>
                                        navigate('/quiz/make-a-quiz')
                                    }
                                >
                                    <AddIcon />
                                </Fab>
                            </>
                        )}
                        {isQuizDetailsViewOpen && (
                            <>
                                <QuizDetailsView roleOfUser="examiner" />
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default ExaminerHomePage;

type examinerRole = 'examiner';
