import * as React from 'react';
import * as R from 'ramda';
import { useLazyGetAllQuestionsOfAQuizQuery } from '../app/apis/apiSlice';
import {
	selectCurrentOnGoingQuiz,
	setCurrentOnGoingQuizQuestions,
} from '../features/quiz/QuizSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import StartQuizHeader from '../features/quiz/startQuiz/StartQuizHeader';
import { getCurrentOnGoingQuizQuestionsData } from '../shared/functions/quizRelated';
import QuestionView from '../features/quiz/startQuiz/QuestionView';
function StartQuiz() {
	const dispatch = useAppDispatch();
	const [isQuickSelectViewOpen, setIsQuickSelectViewOpen] =
		React.useState(false);
	const currentQuiz = useAppSelector(selectCurrentOnGoingQuiz);
	const [fetchQuestionList] = useLazyGetAllQuestionsOfAQuizQuery();
	const saveQuestionData = async () => {
		try {
			const questionListResponse = await fetchQuestionList(
				currentQuiz?._id,
			);
			let questionList =
				getCurrentOnGoingQuizQuestionsData(questionListResponse);
			if (questionList === undefined) {
				// Something wrong with API response
				return;
			}
			R.compose(dispatch, setCurrentOnGoingQuizQuestions)(questionList);
		} catch (error) {
			// Handle error
		}
	};
	React.useEffect(() => {
		saveQuestionData();
	}, []);
	return (
		<>
			<StartQuizHeader
				quizName={currentQuiz?.name}
				quizId={currentQuiz?._id}
				quizDuration={Number(currentQuiz?.quizDuration ?? '0')}
				isQuickSelectViewOpen={isQuickSelectViewOpen}
			/>
			<QuestionView
				isQuickSelectViewOpen={isQuickSelectViewOpen}
				setIsQuickSelectViewOpen={setIsQuickSelectViewOpen}
			/>
		</>
	);
}

export default StartQuiz;
