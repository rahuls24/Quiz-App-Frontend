import AlreadyGivenTheQuizAlertPopup from '@Feature/quiz/examinee/startQuiz/AlreadyGivenTheQuizAlertPopup';
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
import { compose } from 'ramda';
import { useEffect, useState } from 'react';

function StartQuiz() {
    const dispatch = useAppDispatch();

    const [isQuickSelectViewOpen, setIsQuickSelectViewOpen] = useState(false);

    const [autoHideErrorAlertProps, setAutoHideErrorAlertProps] = useState({
        isOpen: false,
        alertMsg: '',
        severity: 'error' as AutoHideAlertSeverity,
        autoHideDuration: 4000,
    });

    const [
        isAlreadyGivenTheQuizAlertPopupOpen,
        setIsAlreadyGivenTheQuizAlertPopupOpen,
    ] = useState(false);

    const currentQuiz = useAppSelector(selectCurrentOnGoingQuiz);

    const [fetchQuestionList] = useLazyGetAllQuestionsOfAQuizQuery();

    const saveQuestionData = async () => {
        try {
            const questionListResponse = await fetchQuestionList(
                currentQuiz?._id
            );
            // Handle error
            if (questionListResponse.status === 'rejected') {
                if ('status' in questionListResponse.error) {
                    if (questionListResponse.error.status === 403) {
                        setIsAlreadyGivenTheQuizAlertPopupOpen(true);
                    }
                } else
                    setAutoHideErrorAlertProps((prev) => {
                        return {
                            ...prev,
                            isOpen: true,
                            alertMsg:
                                'Something went wrong. Please try after sometime',
                        };
                    });
                return;
            }
            let questionsList =
                getCurrentOnGoingQuizQuestionsData(questionListResponse);

            // If data is not coming in right way from api
            if (questionsList === undefined) {
                setAutoHideErrorAlertProps((prev) => {
                    return {
                        ...prev,
                        isOpen: true,
                        alertMsg:
                            'Something went wrong. Please try after sometime',
                    };
                });
                return;
            }
            compose(dispatch, setCurrentOnGoingQuizQuestions)(questionsList);
        } catch (error) {
            console.error('Something went wrong in saveQuestionData');
        }
    };

    const [submitQuiz, { isError: isErrorForSubmitQuiz }] =
        useSubmitQuizMutation();

    const questionsList = useAppSelector(selectCurrentOnGoingQuizQuestions);
    const { _id: quizId, name: quizName } = useAppSelector(
        selectCurrentOnGoingQuiz
    );

    const quizSubmitHandler = async (t1?:QuestionOfCurrentOngoingQuiz) => {
        let submitQuizPayload;
        if(t1){
            submitQuizPayload = getSubmitQuizPayload(quizId, t1);
        } else{
            submitQuizPayload = getSubmitQuizPayload(quizId, questionsList);
        }
       
        console.log('pant in submit', submitQuizPayload, questionsList, quizId);
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
            compose(dispatch, setQuizResultDetails)(resultDetailsPayload);
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
    };

    const onCloseHandlerForAutoHideAlert = () => {
        setAutoHideErrorAlertProps((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };
    // Save Question Data into redux store
    useEffect(() => {
        saveQuestionData();
        compose(dispatch, setCurrentOngoingQuestionIndex)(0);
        // eslint-disable-next-line
    }, []);
    // Showing error msg when there is something wrong while submitting the quiz
    useEffect(() => {
        if (isErrorForSubmitQuiz) {
            setAutoHideErrorAlertProps((prev) => {
                return {
                    ...prev,
                    isOpen: true,
                    alertMsg: 'Something went wrong. Please try after sometime',
                };
            });
        }
    }, [isErrorForSubmitQuiz]);

    const alreadyGivenTheQuizAlertPopupCloseHandler = (reason: string) => {
        if (reason === 'backdropClick') return;
        setIsAlreadyGivenTheQuizAlertPopupOpen(false);
    };
    return (
        <>
            <StartQuizHeader
                quizName={currentQuiz?.name}
                quizId={currentQuiz?._id}
                quizDuration={Number(currentQuiz?.quizDuration ?? '0')}
                isQuickSelectViewOpen={isQuickSelectViewOpen}
                quizSubmitHandler={quizSubmitHandler}
                setIsAlreadyGivenTheQuizAlertPopupOpen={
                    setIsAlreadyGivenTheQuizAlertPopupOpen
                }
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
            <AlreadyGivenTheQuizAlertPopup
                open={isAlreadyGivenTheQuizAlertPopupOpen}
                onCloseHandler={alreadyGivenTheQuizAlertPopupCloseHandler}
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
