import { QuestionOfCurrentOngoingQuiz } from '@Type/Quiz';

export function getQuestionsData(response: any) {
    let questions = response?.data?.questions;
    if (Array.isArray(questions)) {
        const questionsList = questions.map((question: any) => {
            let _id = '';
            let title = '';
            let options = [] as string[];
            let answers = [] as string[];
            let questionType = 'singleAnswer' as
                | 'singleAnswer'
                | 'multipleAnswer';
            if ('_id' in question && typeof question?._id === 'string') {
                _id = question._id;
            }
            if (
                'questionType' in question &&
                typeof question?.questionType === 'string'
            ) {
                questionType = question.questionType;
            }
            if (
                'questionText' in question &&
                typeof question?.questionText === 'string'
            ) {
                title = question.questionText;
            }
            if ('options' in question && Array.isArray(question.options)) {
                if (
                    question.options.length > 0 &&
                    typeof question.options[0] === 'string'
                ) {
                    options = question.options;
                }
            }
            if ('answers' in question && Array.isArray(question.answers)) {
                if (
                    question.answers.length > 0 &&
                    typeof question.answers[0] === 'string'
                ) {
                    answers = question.answers;
                }
            }

            return {
                _id,
                title,
                options,
                answers,
                questionType,
            };
        });
        return questionsList;
    } else {
        return undefined;
    }
}

export function getCurrentOnGoingQuizQuestionsData(questionResponse: any) {
    const questionData = getQuestionsData(questionResponse);
    if (questionData === undefined) return undefined;
    const questionDataForResponse = [] as QuestionOfCurrentOngoingQuiz;
    questionData.forEach((question, index) => {
        questionDataForResponse.push({
            ...question,
            isVisited: false,
            isMarkedAsReview: false,
            isAnswered: false,
            index: index,
        });
    });
    return questionDataForResponse;
}

export function calculateAccuracy(
    totalCorrectAnswers: number,
    totalWrongAnswer: number
) {
    if (totalCorrectAnswers === 0) return 0;
    if (totalWrongAnswer === 0) return 0;
    return (
        (totalCorrectAnswers * 100) / (totalCorrectAnswers + totalWrongAnswer)
    );
}
