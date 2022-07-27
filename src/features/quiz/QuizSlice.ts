import { QuestionOfCurrentOngoingQuiz } from './../../types/Quiz';
import { RootState } from './../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizData } from '../../types/Quiz';
import { IQuiz } from '../../interfaces/Quiz';

export interface IQuizRelatedRelated {
	isQuizDetailsViewOpen: boolean;
	quizData: QuizData;
	currentOnGoingQuiz: IQuiz;

	currentOnGoingQuizQuestions: QuestionOfCurrentOngoingQuiz;
	currentOngoingQuestionIndex: number;
}

const initialState: IQuizRelatedRelated = {
	isQuizDetailsViewOpen: false,
	quizData: {} as QuizData,
	currentOnGoingQuiz: {} as IQuiz,
	currentOnGoingQuizQuestions: [] as QuestionOfCurrentOngoingQuiz,
	currentOngoingQuestionIndex: 0,
};

export const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {
		setIsQuizDetailsViewOpen: (state, action: PayloadAction<boolean>) => {
			state.isQuizDetailsViewOpen = action.payload;
		},
		setQuizData: (state, action: PayloadAction<QuizData>) => {
			state.quizData = action.payload;
		},
		setCurrentOnGoingQuiz: (state, action: PayloadAction<IQuiz>) => {
			state.currentOnGoingQuiz = action.payload;
		},
		setCurrentOnGoingQuizQuestions: (
			state,
			action: PayloadAction<QuestionOfCurrentOngoingQuiz>,
		) => {
			state.currentOnGoingQuizQuestions = action.payload;
		},
		setCurrentOngoingQuestionIndex: (
			state,
			action: PayloadAction<number>,
		) => {
			state.currentOngoingQuestionIndex = action.payload;
		},
	},
});

export const {
	setIsQuizDetailsViewOpen,
	setQuizData,
	setCurrentOnGoingQuiz,
	setCurrentOnGoingQuizQuestions,
	setCurrentOngoingQuestionIndex,
} = quizSlice.actions;

export const selectIsQuizDetailsViewOpen = (state: RootState) =>
	state.quiz.isQuizDetailsViewOpen;
export const selectQuizData = (state: RootState) => state.quiz.quizData;

export const selectCurrentOnGoingQuiz = (state: RootState) =>
	state.quiz.currentOnGoingQuiz;
export const selectCurrentOnGoingQuizQuestions = (state: RootState) =>
	state.quiz.currentOnGoingQuizQuestions;
export const selectCurrentOngoingQuestionIndex = (state: RootState) =>
	state.quiz.currentOngoingQuestionIndex;
export default quizSlice.reducer;
