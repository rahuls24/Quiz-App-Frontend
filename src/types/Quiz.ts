import { IQuiz } from './../interfaces/Quiz';
export type QuizzesMappingWithIndex = {
	[k: string]: IQuiz;
};
export type Question = {
	title: string;
	options: string[];
	correctAnswers: number[];
};