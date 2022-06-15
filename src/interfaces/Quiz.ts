export interface IQuiz{
	_id:string,
	name:string;
	topics: string[];
	createdBy:string,
	enrolledBy:string[];
	marks?:object[],
	isFree:boolean;
	price:number;
	imageUrl: string;
	createOn: Date;
}

export interface IQuizRow {
	id: number;
	quizName: string;
	topics: string;
	enrolledBy: number;
}