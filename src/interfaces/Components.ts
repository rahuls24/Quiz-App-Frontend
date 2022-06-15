import { IQuiz } from "./Quiz";

export interface IAutoHideAlert { 
	isOpen: boolean;
	onCloseHandler?: () => void;
	alertMsg: string;
	severity: 'error' | 'warning' | 'success';
	autoHideDuration: number;
}
export interface IQuizzesTableProps{
	quizzesList: Array<IQuiz>;
}