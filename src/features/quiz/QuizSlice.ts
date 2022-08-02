import {
    QuestionOfCurrentOngoingQuiz,
    QuizResultDetails,
} from './../../types/Quiz';
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
    quizResultDetails: QuizResultDetails;
}

const initialState: IQuizRelatedRelated = {
    isQuizDetailsViewOpen: false,
    quizData: {} as QuizData,
    currentOnGoingQuiz: {} as IQuiz,
    currentOnGoingQuizQuestions: [] as QuestionOfCurrentOngoingQuiz,
    currentOngoingQuestionIndex: 0,
    quizResultDetails: {
        quizName: '',
        numberOfWrongAnswers: 0,
        numberOfRightAnswers: 0,
        skippedQuestions: 0,
        totalTimeTaken: 0,
        marks: 0,
    },
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
            action: PayloadAction<QuestionOfCurrentOngoingQuiz>
        ) => {
            state.currentOnGoingQuizQuestions = action.payload;
        },
        setCurrentOngoingQuestionIndex: (
            state,
            action: PayloadAction<number>
        ) => {
            state.currentOngoingQuestionIndex = action.payload;
        },
        setQuizResultDetails: (
            state,
            action: PayloadAction<QuizResultDetails>
        ) => {
            state.quizResultDetails = action.payload;
        },
    },
});

export const {
    setIsQuizDetailsViewOpen,
    setQuizData,
    setCurrentOnGoingQuiz,
    setCurrentOnGoingQuizQuestions,
    setCurrentOngoingQuestionIndex,
    setQuizResultDetails,
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
export const selectQuizResultDetails = (state: RootState) =>
    state.quiz.quizResultDetails;

export default quizSlice.reducer;
