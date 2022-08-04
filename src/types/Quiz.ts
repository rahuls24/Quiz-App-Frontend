export type Quiz = {
    _id: string;
    name: string;
    topics: string[];
    createdBy: string;
    enrolledBy: string[];
    marks?: object[];
    isFree: boolean;
    price: number;
    imageUrl: string;
    createOn: Date;
    quizDuration: number;
};
export type QuizzesMappingWithIndex = {
    [k: string]: Quiz;
};
export type Question = {
    title: string;
    options: string[];
    answers: number[];
};

export type QuizData = {
    quiz: Quiz;
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
    index: number;
}[];

export type QuizResultDetails = {
    quizName: string;
    numberOfRightAnswers: number;
    numberOfWrongAnswers: number;
    skippedQuestions: number;
    totalTimeTaken: number;
    marks: number;
};
export type QuizRow = {
    id: number;
    quizName: string;
    topics: string;
    enrolledBy: number;
};

export type AutoHideAlertProps = {
    isOpen: boolean;
    onCloseHandler?: () => void;
    alertMsg: string;
    severity: 'error' | 'warning' | 'success';
    autoHideDuration: number;
};
