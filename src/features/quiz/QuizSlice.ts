import { RootState } from './../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizData } from '../../types/Quiz';

export interface IQuizRelatedRelated {
	isQuizDetailsViewOpen: boolean;
	quizData: QuizData;
}

const initialState: IQuizRelatedRelated = {
	isQuizDetailsViewOpen: false,
	quizData: {} as QuizData,
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
	},
});

export const { setIsQuizDetailsViewOpen, setQuizData } = quizSlice.actions;

export const selectIsQuizDetailsViewOpen = (state: RootState) =>
	state.quiz.isQuizDetailsViewOpen;
export const selectQuizData = (state: RootState) => state.quiz.quizData;

export default quizSlice.reducer;
