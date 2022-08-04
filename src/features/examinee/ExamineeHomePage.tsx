import QuizDetailsView from '@Feature/quiz/QuizDetailsView';
import {
    selectIsQuizDetailsViewOpen,
    setIsQuizDetailsViewOpen,
} from '@Feature/quiz/QuizSlice';
import QuizView from '@Feature/quiz/QuizView';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    useGetAllEnrolledCoursesQuery,
    useGetAllUnenrolledCoursesQuery,
} from '@ReduxStore/apis/apiSlice';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import AutoHideAlert from '@SharedComponent/AutoHideAlert';
import { AutoHideAlertProps } from '@Type/Quiz';
import { roleOfUser } from '@Type/User';
import * as R from 'ramda';
import React from 'react';

const initialState: ExamineeHomePageLocalState = {
    shouldShowReloadBtnForEnrolledQuizApiError: true,
    shouldShowReloadBtnForUnenrolledQuizApiError: true,
    currentLoadingEnrollBtns: [] as string[],
    quizAlertMsg: {
        isOpen: false,
        alertMsg: '',
        severity: 'error',
        autoHideDuration: 6000,
    },
};

function ExamineeHomePage() {
    const {
        data: { quizzes: enrolledQuizzesList = [] } = {},
        isFetching: isEnrolledQuizApiFetching,
        isError: isEnrolledQuizHavingError,
        error: errorOfEnrolledQuizApi,
        refetch: reFetchEnrolledQuizzesList,
    } = useGetAllEnrolledCoursesQuery(null, {
        refetchOnReconnect: true,
    });

    const {
        data: { quizzes: unenrolledQuizzesList = [] } = {},
        isFetching: isUnenrolledQuizApiFetching,
        isError: isUnenrolledQuizHavingError,
        error: errorOfUnenrolledQuizApi,
        refetch: reFetchUnenrolledQuizzesList,
    } = useGetAllUnenrolledCoursesQuery(null, {
        refetchOnReconnect: true,
    });

    const [state, dispatch] = React.useReducer(reducer, initialState);
    const actionDispatcher = React.useMemo(() => {
        return actionCreator(dispatch);
    }, []);
    React.useEffect(() => {
        if (!isUnenrolledQuizHavingError) return;
        if (errorOfUnenrolledQuizApi && 'status' in errorOfUnenrolledQuizApi) {
            if (errorOfUnenrolledQuizApi.status === 500)
                actionDispatcher.setShouldShowReloadBtnForUnenrolledQuizApiError(
                    false
                );
        }
    }, [
        isUnenrolledQuizHavingError,
        errorOfUnenrolledQuizApi,
        actionDispatcher,
    ]);

    React.useEffect(() => {
        if (isEnrolledQuizHavingError) return;
        if (errorOfEnrolledQuizApi && 'status' in errorOfEnrolledQuizApi) {
            if (errorOfEnrolledQuizApi.status === 500)
                actionDispatcher.setShouldShowReloadBtnForEnrolledQuizApiError(
                    false
                );
        }
    }, [isEnrolledQuizHavingError, errorOfEnrolledQuizApi, actionDispatcher]);

    const liveQuizViewProps = React.useMemo(() => {
        return {
            isFetching: isUnenrolledQuizApiFetching,
            isError: isUnenrolledQuizHavingError,
            reFetchQuizList: reFetchUnenrolledQuizzesList,
            shouldShowReloadBtn:
                state.shouldShowReloadBtnForUnenrolledQuizApiError,
            quizList: unenrolledQuizzesList,
            cardViewGridStyle: {
                xs: 4,
                md: 6,
            },
            headerTitle: 'Live Quizzes',
            roleOfUser: 'examinee' as roleOfUser,
            renderedBy: 'liveQuizzes' as renderByForExaminee,
            setAlertMsg: actionDispatcher.setQuizAlertMsg,
        };
    }, [
        isUnenrolledQuizApiFetching,
        isUnenrolledQuizHavingError,
        reFetchUnenrolledQuizzesList,
        state.shouldShowReloadBtnForUnenrolledQuizApiError,
        unenrolledQuizzesList,
        actionDispatcher.setQuizAlertMsg,
    ]);
    const enrolledQuizViewProps = React.useMemo(() => {
        return {
            isFetching: isEnrolledQuizApiFetching,
            isError: isEnrolledQuizHavingError,
            reFetchQuizList: reFetchEnrolledQuizzesList,
            shouldShowReloadBtn:
                state.shouldShowReloadBtnForEnrolledQuizApiError,
            quizList: enrolledQuizzesList,
            cardViewGridStyle: {
                xs: 4,
                md: 12,
            },
            headerTitle: 'My Quizzes',
            roleOfUser: 'examinee' as roleOfUser,
            renderedBy: 'enrolledQuizzes' as renderByForExaminee,
            setAlertMsg: actionDispatcher.setQuizAlertMsg,
        };
    }, [
        isEnrolledQuizApiFetching,
        isEnrolledQuizHavingError,
        reFetchEnrolledQuizzesList,
        state.shouldShowReloadBtnForEnrolledQuizApiError,
        enrolledQuizzesList,
        actionDispatcher.setQuizAlertMsg,
    ]);

    // View Quiz
    const reduxDispatch = useAppDispatch();
    const isQuizDetailsViewOpen = useAppSelector(selectIsQuizDetailsViewOpen);

    React.useEffect(() => {
        return () => {
            R.compose(reduxDispatch, setIsQuizDetailsViewOpen)(false);
        };
    }, [reduxDispatch]);
    React.useEffect(() => {
        reFetchEnrolledQuizzesList();
        reFetchUnenrolledQuizzesList();
        return () => actionDispatcher.setCurrentLoadingEnrollBtns([]);
    }, []);
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
                        <QuizView {...enrolledQuizViewProps} />
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
                        {isQuizDetailsViewOpen ? (
                            <QuizDetailsView roleOfUser="examinee" />
                        ) : (
                            <QuizView {...liveQuizViewProps} />
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <AutoHideAlert
                isOpen={state.quizAlertMsg.isOpen}
                alertMsg={state.quizAlertMsg.alertMsg}
                severity={state.quizAlertMsg.severity}
                onCloseHandler={() => {
                    let currentQuizAlertMsg = { ...state.quizAlertMsg };
                    currentQuizAlertMsg.isOpen = false;
                    actionDispatcher.setQuizAlertMsg(currentQuizAlertMsg);
                }}
                autoHideDuration={state.quizAlertMsg.autoHideDuration}
            />
        </>
    );
}

export default ExamineeHomePage;

// Things related to useReducer
type ExamineeHomePageLocalState = {
    shouldShowReloadBtnForEnrolledQuizApiError: boolean;
    shouldShowReloadBtnForUnenrolledQuizApiError: boolean;
    currentLoadingEnrollBtns: string[];
    quizAlertMsg: AutoHideAlertProps;
};

type reducerActionWithBooleanPayload = {
    type:
        | 'SET_RELOAD_BTN_FOR_ENROLLED_QUIZ_API_ERROR'
        | 'SET_RELOAD_BTN_FOR_UNENROLLED_QUIZ_API_ERROR';
    payload: boolean;
};
type reducerActionWithArrOfStrPayload = {
    type: 'SET_CURRENT_LOADING_ENROLL_BTNS';
    payload: string[];
};
type reducerActionWithIAutoHideAlertPayload = {
    type: 'SET_QUIZ_ALERT_MSG';
    payload: AutoHideAlertProps;
};
type reducerAction =
    | reducerActionWithBooleanPayload
    | reducerActionWithArrOfStrPayload
    | reducerActionWithIAutoHideAlertPayload;

function reducer(state: ExamineeHomePageLocalState, action: reducerAction) {
    switch (action.type) {
        case 'SET_RELOAD_BTN_FOR_UNENROLLED_QUIZ_API_ERROR':
            return {
                ...state,
                shouldShowReloadBtnForEnrolledQuizApiError: action.payload,
            };
        case 'SET_RELOAD_BTN_FOR_ENROLLED_QUIZ_API_ERROR':
            return {
                ...state,
                shouldShowReloadBtnForEnrolledQuizApiError: action.payload,
            };
        case 'SET_CURRENT_LOADING_ENROLL_BTNS':
            return {
                ...state,
                currentLoadingEnrollBtns: action.payload,
            };
        case 'SET_QUIZ_ALERT_MSG':
            return {
                ...state,
                quizAlertMsg: action.payload,
            };
        default:
            return state;
    }
}

function actionCreator(dispatch: React.Dispatch<reducerAction>) {
    function setShouldShowReloadBtnForEnrolledQuizApiError(payload: boolean) {
        dispatch({
            type: 'SET_RELOAD_BTN_FOR_ENROLLED_QUIZ_API_ERROR',
            payload,
        });
    }
    function setShouldShowReloadBtnForUnenrolledQuizApiError(payload: boolean) {
        dispatch({
            type: 'SET_RELOAD_BTN_FOR_UNENROLLED_QUIZ_API_ERROR',
            payload,
        });
    }

    function setQuizAlertMsg(payload: AutoHideAlertProps) {
        dispatch({
            type: 'SET_QUIZ_ALERT_MSG',
            payload,
        });
    }

    function setCurrentLoadingEnrollBtns(payload: string[]) {
        dispatch({
            type: 'SET_CURRENT_LOADING_ENROLL_BTNS',
            payload,
        });
    }
    return {
        setShouldShowReloadBtnForEnrolledQuizApiError,
        setCurrentLoadingEnrollBtns,
        setQuizAlertMsg,
        setShouldShowReloadBtnForUnenrolledQuizApiError,
    };
}

export type renderByForExaminee = 'liveQuizzes' | 'enrolledQuizzes';
