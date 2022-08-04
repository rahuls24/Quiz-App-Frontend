import QuestionView from '@Feature/quiz/examinee/startQuiz/QuestionView';
import StartQuizHeader from '@Feature/quiz/examinee/startQuiz/StartQuizHeader';
import {
    selectCurrentOnGoingQuiz,
    selectCurrentOnGoingQuizQuestions,
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
import { QuestionOfCurrentOngoingQuiz } from '@Type/Quiz';
import * as R from 'ramda';
import * as React from 'react';

function StartQuiz() {
    const dispatch = useAppDispatch();
    const [isQuickSelectViewOpen, setIsQuickSelectViewOpen] =
        React.useState(false);
    const [autoHideErrorAlertMsg, setAutoHideErrorAlertMsg] = React.useState({
        isOpen: false,
        alertMsg: '',
        severity: 'error' as 'error',
        autoHideDuration: 4000,
    });
    const currentQuiz = useAppSelector(selectCurrentOnGoingQuiz);
    const [fetchQuestionList] = useLazyGetAllQuestionsOfAQuizQuery();
    const saveQuestionData = async () => {
        try {
            const questionListResponse = await fetchQuestionList(
                currentQuiz?._id
            );
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
    const [
        submitQuiz,
        {
            isError: isErrorForSubmitQuiz,
            isSuccess: isSuccessForSubmitQuiz,
            isLoading: isLoadingForSubmitQuiz,
        },
    ] = useSubmitQuizMutation();
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
                // Handle failure case
            }
            const resultDetailsPayload = {
                quizName,
                numberOfRightAnswers: quizResultDetails.numberOfRightAnswers,
                numberOfWrongAnswers: quizResultDetails.numberOfWrongAnswers,
                skippedQuestions: quizResultDetails.skippedQuestions,
                totalTimeTaken: quizResultDetails.totalTimeTaken,
                marks: quizResultDetails.marks,
            };
            R.compose(dispatch, setQuizResultDetails)(resultDetailsPayload);
            return true;
        } else {
            return false;
        }
    }, [dispatch, questionsList, quizId, quizName, submitQuiz]);
    React.useEffect(() => {
        saveQuestionData();
        // eslint-disable-next-line
    }, []);
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
            <AutoHideAlert {...autoHideErrorAlertMsg} />
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
