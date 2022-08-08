import QuestionView from '@Feature/quiz/examinee/startQuiz/QuestionView';
import StartQuizHeader from '@Feature/quiz/examinee/startQuiz/StartQuizHeader';
import {
    selectCurrentOnGoingQuiz,
    selectCurrentOnGoingQuizQuestions,
    setCurrentOngoingQuestionIndex,
    setCurrentOnGoingQuizQuestions,
    setQuizResultDetails,
} from '@Feature/quiz/QuizSlice';
import {
    useLazyGetAllQuestionsOfAQuizQuery,
    useSubmitQuizMutation,
} from '@ReduxStore/apis/apiSlice';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import AutoHideAlert from '@SharedComponent/AutoHideAlert';
import { getCurrentOnGoingQuizQuestionsData } from '@SharedFunction/quizRelated';
import {
    AutoHideAlertSeverity,
    QuestionOfCurrentOngoingQuiz,
} from '@Type/Quiz';
import * as R from 'ramda';
import * as React from 'react';

function StartQuiz() {
    const dispatch = useAppDispatch();
    const [isQuickSelectViewOpen, setIsQuickSelectViewOpen] =
        React.useState(false);
    const [autoHideErrorAlertProps, setAutoHideErrorAlertProps] =
        React.useState({
            isOpen: false,
            alertMsg: '',
            severity: 'error' as AutoHideAlertSeverity,
            autoHideDuration: 4000,
        });
    const currentQuiz = useAppSelector(selectCurrentOnGoingQuiz);
    const [fetchQuestionList, { isError: isErrorForFetchQuestionList }] =
        useLazyGetAllQuestionsOfAQuizQuery();
    const saveQuestionData = async () => {
        try {
            const questionListResponse = await fetchQuestionList(
                currentQuiz?._id
            );
            if (questionListResponse.status === 'rejected') {
                // Handle error
                setAutoHideErrorAlertProps((prev) => {
                    return {
                        ...prev,
                        isOpen: true,
                        alertMsg:
                            'Something went wrong while fetching questions of quiz',
                    };
                });
                return;
            }
            let questionsList =
                getCurrentOnGoingQuizQuestionsData(questionListResponse);
            if (questionsList === undefined) {
                // Something wrong with API response
                return;
            }
            R.compose(dispatch, setCurrentOnGoingQuizQuestions)(questionsList);
        } catch (error) {
            // Handle error
        }
    };
    const [submitQuiz, { isError: isErrorForSubmitQuiz }] =
        useSubmitQuizMutation();
    const questionsList = useAppSelector(selectCurrentOnGoingQuizQuestions);
    const { _id: quizId, name: quizName } = useAppSelector(
        selectCurrentOnGoingQuiz
    );
    const quizSubmitHandler = React.useCallback(async () => {
        const submitQuizPayload = getSubmitQuizPayload(quizId, questionsList);
        const submittedQuizResponse = await submitQuiz(submitQuizPayload);
        if ('data' in submittedQuizResponse) {
            const { result: quizResultDetails } = submittedQuizResponse.data;
            if (!quizResultDetails) {
                setAutoHideErrorAlertProps((prev) => {
                    return {
                        ...prev,
                        isOpen: true,
                        alertMsg:
                            'Something went wrong while submitting the quiz',
                    };
                });
            }
            const resultDetailsPayload = {
                quizName,
                numberOfRightAnswers: quizResultDetails.numberOfRightAnswers,
                numberOfWrongAnswers: quizResultDetails.numberOfWrongAnswers,
                numberSkippedQuestions:
                    quizResultDetails.numberSkippedQuestions,
                totalTimeTaken: quizResultDetails.totalTimeTaken,
                marks: quizResultDetails.marks,
            };
            R.compose(dispatch, setQuizResultDetails)(resultDetailsPayload);
            return true;
        } else {
            setAutoHideErrorAlertProps((prev) => {
                return {
                    ...prev,
                    isOpen: true,
                    alertMsg: 'Something went wrong while submitting the quiz',
                };
            });
            return false;
        }
    }, [dispatch, questionsList, quizId, quizName, submitQuiz]);
    const onCloseHandlerForAutoHideAlert = () => {
        setAutoHideErrorAlertProps((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };
    React.useEffect(() => {
        saveQuestionData();
        R.compose(dispatch, setCurrentOngoingQuestionIndex)(0);
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (isErrorForSubmitQuiz || isErrorForFetchQuestionList) {
            console.log('Effect is called');
            setAutoHideErrorAlertProps((prev) => {
                return {
                    ...prev,
                    isOpen: true,
                    alertMsg: 'Something went wrong. Please try after sometime',
                };
            });
        }
    }, [isErrorForSubmitQuiz, isErrorForFetchQuestionList]);
    return (
        <>
            <StartQuizHeader
                quizName={currentQuiz?.name}
                quizId={currentQuiz?._id}
                quizDuration={Number(currentQuiz?.quizDuration ?? '0')}
                isQuickSelectViewOpen={isQuickSelectViewOpen}
                quizSubmitHandler={quizSubmitHandler}
            />
            <QuestionView
                isQuickSelectViewOpen={isQuickSelectViewOpen}
                setIsQuickSelectViewOpen={setIsQuickSelectViewOpen}
                quizSubmitHandler={quizSubmitHandler}
            />
            <AutoHideAlert
                {...autoHideErrorAlertProps}
                onCloseHandler={onCloseHandlerForAutoHideAlert}
            />
        </>
    );
}

export default StartQuiz;
type submittedQuestionsType = {
    _id: string;
    answers: Array<string>;
};
function getSubmitQuizPayload(
    quizId: string,
    questionsList: QuestionOfCurrentOngoingQuiz
) {
    let submittedQuestions = [] as Array<submittedQuestionsType>;
    questionsList.forEach((question) => {
        const questionForPayload = {
            _id: question._id,
            answers: question.answers,
        };
        submittedQuestions.push(questionForPayload);
    });
    return {
        quizId,
        submittedQuestions,
    };
}
