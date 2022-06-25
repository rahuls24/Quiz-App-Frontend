import { IQuiz } from './../interfaces/Quiz';
export type QuizzesMappingWithIndex = {
	[k: string]: IQuiz;
};
export type Question = {
	title: string;
	options: string[];
	answers: number[];
};

export type QuizData= {
	quiz: IQuiz,
	questions :{
		_id:string;
		title: string;
		options: string[];
		answers: string[];
	}[]
}
