import QuizHistoryTable from '@Feature/quiz/examinee/quizHistory/QuizHistoryTable';
import UserQuizHistorySummery from '@Feature/quiz/examinee/quizHistory/UserQuizHistorySummery';
import Box from '@mui/material/Box';
import { useGetQuizzesHistoryQuery } from '@ReduxStore/apis/apiSlice';
import Header from '@SharedComponent/Header';
import { QuizzesHistory } from '@Type/Quiz';
import { useEffect, useMemo } from 'react';
function QuizHistory() {
    const {
        data: { quizzesDetails = [] } = {},
        isFetching: isQuizzesDetailsFetching,
        refetch,
    } = useGetQuizzesHistoryQuery('');
    useEffect(() => {
        refetch();
    }, []);

    const quizzesHistoryData = useMemo(() => {
        return giveTypeToQuizzesHistoryResponse(quizzesDetails);
    }, [quizzesDetails]);

    const quizzesSummeryDetails = useMemo(() => {
        return getQuizzesSummery(quizzesHistoryData);
    }, [quizzesHistoryData]);

    return (
        <>
            <Header />
            <Box sx={{ margin: { xs: 0, sm: 2 } }}>
                <UserQuizHistorySummery {...quizzesSummeryDetails} />
            </Box>
            <Box sx={{ margin: { xs: 0, sm: 2 } }}>
                <QuizHistoryTable
                    quizzesHistoryData={quizzesHistoryData}
                    isLoading={isQuizzesDetailsFetching}
                />
            </Box>
        </>
    );
}

export default QuizHistory;

// Util Functions
function getQuizzesSummery(quizzesHistory: Array<QuizzesHistory>) {
    let quizzesSummery = {
        totalQuizzes: 0,
        totalCorrectAnswers: 0,
        totalWrongAnswer: 0,
        totalSkippedQuestions: 0,
    };

    quizzesSummery.totalQuizzes = quizzesHistory.length;
    quizzesHistory.forEach((quiz) => {
        const { quizResult } = quiz;
        if (!quizResult) return;
        quizzesSummery.totalCorrectAnswers += quizResult.numberOfRightAnswers;
        quizzesSummery.totalWrongAnswer += quizResult.numberOfRightAnswers;
        quizzesSummery.totalSkippedQuestions +=
            quizResult.numberSkippedQuestions;
    });
    return quizzesSummery;
}

function giveTypeToQuizzesHistoryResponse(
    quizzesHistoryResponseData: Array<any>
) {
    const quizzesHistory = [] as Array<QuizzesHistory>;

    quizzesHistoryResponseData.forEach((quizData) => {
        const {
            quizId,
            quizName,
            quizDuration,
            quizResult: quizResultData,
        } = quizData;

        const quizResult = {
            marks: quizResultData.marks ?? 0,
            examineeId: quizResultData.examineeId ?? '',
            numberOfRightAnswers: quizResultData.numberOfRightAnswers ?? 0,
            numberOfWrongAnswers: quizResultData.numberOfWrongAnswers ?? 0,
            totalTimeTaken: quizResultData.totalTimeTaken ?? 0,
            numberSkippedQuestions: quizResultData.numberSkippedQuestions ?? 0,
        };
        quizzesHistory.push({
            quizId,
            quizName,
            quizDuration,
            quizResult,
        });
    });
    return quizzesHistory;
}
