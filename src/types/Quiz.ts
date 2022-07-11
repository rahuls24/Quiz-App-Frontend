import { IQuiz } from './../interfaces/Quiz';
export type QuizzesMappingWithIndex = {
	[k: string]: IQuiz;
};
export type Question = {
	title: string;
	options: string[];
	answers: number[];
};

export type QuizData = {
	quiz: IQuiz;
	questions: {
		_id: string;
		questionType: 'singleAnswer' | 'multipleAnswer';
		title: string;
		options: string[];
		answers: string[];
	}[];
};

export type QuestionOfCurrentOngoingQuiz = {
	_id: string;
	questionType: 'singleAnswer' | 'multipleAnswer';
	title: string;
	options: string[];
	answers: string[];
	isVisited: boolean;
	isMarkedAsReview: boolean;
	isAnswered: boolean;
	isActive:boolean;
	index:number;
}[];
