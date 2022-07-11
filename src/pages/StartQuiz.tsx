import * as React from 'react';
import * as R from 'ramda';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Drawer from '@mui/material/Drawer';
import QuestionsList from '../features/quiz/QuestionsList';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import {
	deepPurple,
	green,
	red,
	indigo,
	purple,
	teal,
} from '@mui/material/colors';
import { useLazyGetAllQuestionsOfAQuizQuery } from '../app/apis/apiSlice';
import {
	selectCurrentOnGoingQuiz,
	setCurrentOnGoingQuizQuestions,
	selectCurrentOnGoingQuizQuestions,
	selectCurrentOngoingQuestionIndex,
} from '../features/quiz/QuizSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import StartQuizHeader from '../features/quiz/startQuiz/StartQuizHeader';
import { getCurrentOnGoingQuizQuestionsData } from '../shared/functions/quizRelated';
import { QuestionOfCurrentOngoingQuiz } from '../types/Quiz';
function StartQuiz() {
	const dispatch = useAppDispatch();
	const [isQuickSelectViewOpen, 	] =
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
			/>
			<QuestionView isQuickSelectViewOpen={isQuickSelectViewOpen} />
		</>
	);
}

export default StartQuiz;

function getCurrentActiveQuiz(questionsList: QuestionOfCurrentOngoingQuiz) {
	return questionsList.find(question => question.isActive);
}

type QuestionViewProps = {
	isQuickSelectViewOpen: boolean;
};
function QuestionView(props: QuestionViewProps) {
	const { isQuickSelectViewOpen } = props;
	const currentOnGoingQuizQuestions = useAppSelector(
		selectCurrentOnGoingQuizQuestions,
	);
    const currentOngoingQuestionIndex = useAppSelector(selectCurrentOngoingQuestionIndex);
	const updateAnswer = (action:string,value?:string) =>{   
		let currentQuiz = currentOnGoingQuizQuestions[currentOngoingQuestionIndex];
		switch (action) {
			case 'add':
				break;
			case 'remove':
				break;
			case 'addAndMarkAsReview':
				break;
			case 'removeAndMarkAndReview':	
				break;
			default:
				break;
		}
	}
	const [open, setOpen] = React.useState(false);
	const [answers, setAnswers] = React.useState<Array<string>>([]);
	const optionOnchangeHandler = (value: string, shouldAdd: boolean,questionType:'singleAnswer' | 'multipleAnswer') => {
		if(questionType==='singleAnswer'){

		}
		else if(questionType==='multipleAnswer'){
			if (shouldAdd) {
				if (!answers.includes(value)) setAnswers(prev => [...prev, value]);
			} else setAnswers(prev => prev.filter(answer => answer !== value));
		}
		
	};
	const currentActiveQuestion = getCurrentActiveQuiz(
		currentOnGoingQuizQuestions,
	);
	React.useEffect(()=>{
		const {answers} = currentOnGoingQuizQuestions[currentOngoingQuestionIndex];
		setAnswers(answers)
	},[currentOnGoingQuizQuestions[currentOngoingQuestionIndex]])
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					padding: 2,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row-reverse',
						paddingLeft: 2,
					}}
				>
					<ChevronLeftIcon
						fontSize='large'
						sx={{ cursor: 'pointer' }}
						onClick={() => setOpen(!open)}
					/>
				</Box>
				<Box>
					<Typography
						variant='h5'
						component='div'
					>{`Question No. 1`}</Typography>
					<Divider variant='fullWidth' />
				</Box>
				<Box>
					{currentActiveQuestion !== undefined && (
						<>
							<Box
								sx={{
									marginTop: 2,
									display: 'flex',
									gap: 2,
									alignItems: 'center',
								}}
							>
								<Typography
									variant='h6'
									component='div'
								>{`Direction:`}</Typography>
								<Typography
									variant='h6'
									component='div'
									sx={{ fontWeight: 400 }}
								>
									{currentActiveQuestion.title}
								</Typography>
							</Box>
							<QuestionsList
								options={currentActiveQuestion.options}
								answers={answers}
								isCreatedByUser={false}
								onChangeHandler={optionOnchangeHandler}
								questionType={
									currentActiveQuestion.questionType
								}
							/>
						</>
					)}
				</Box>
			</Box>
			<BottomNavigationForQuestionView />
			<QuestionQuickSelect
				open={open}
				handleDrawerClose={() => setOpen(false)}
				questionList={currentOnGoingQuizQuestions}
			/>
		</>
	);
}
const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

type OptionBtnProps = {
	btnType: 'answered' | 'markedForReview' | 'notVisited' | 'notAnswered';
	questionNumber: number | string;
};
function OptionBtn(props: OptionBtnProps) {
	// answered, markedForReview, notVisited,notAnswered
	const { btnType, questionNumber } = props;
	const btnColorAndBadgeIcon = {
		answered: {
			color: green[500],
			backgroundColor: green[500],
			hoverBackgroundColor: green[700],
			badgeColor: teal['A400'],
		},
		markedForReview: {
			color: deepPurple[500],
			hoverBackgroundColor: deepPurple[700],
			badgeColor: deepPurple['A200'],
		},
		notVisited: {
			color: deepPurple[50],
			hoverBackgroundColor: deepPurple[100],
			badgeColor: indigo[700],
		},
		notAnswered: {
			color: red[500],
			hoverBackgroundColor: red[700],
			badgeColor: purple['A400'],
		},
	};
	const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
		color: theme.palette.getContrastText(
			btnColorAndBadgeIcon[btnType].color,
		),
		backgroundColor: btnColorAndBadgeIcon[btnType].color,
		'&:hover': {
			backgroundColor: btnColorAndBadgeIcon[btnType].color,
		},
	}));
	return (
		<>
			<ColorButton>{questionNumber}</ColorButton>
		</>
	);
}

type QuestionQuickSelectProps = {
	open: boolean;
	handleDrawerClose: any;
	questionList: QuestionOfCurrentOngoingQuiz | undefined;
};
function QuestionQuickSelect(props: QuestionQuickSelectProps) {
	const { open, handleDrawerClose, questionList } = props;
	return (
		<>
			<Drawer
				sx={{
					width: 240,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: 240,
						boxSizing: 'border-box',
					},
				}}
				variant='persistent'
				anchor='right'
				open={open}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						<ChevronRightIcon fontSize='large' />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '15px',
						marginTop: 2,
					}}
				>
					{questionList !== undefined &&
						questionList.map((question: any, index: any) => {
							if (question.isAnswered)
								return (
									<OptionBtn
										btnType='answered'
										questionNumber={index}
									/>
								);
							if (question.isMarkedAsReview)
								return (
									<OptionBtn
										btnType='markedForReview'
										questionNumber={index}
									/>
								);
							if (!question.isVisited)
								return (
									<OptionBtn
										btnType='notVisited'
										questionNumber={index}
									/>
								);
							if (question.isVisited)
								return (
									<OptionBtn
										btnType='notAnswered'
										questionNumber={index}
									/>
								);
						})}
				</Box>
				<Box
					sx={{
						width: 240,
						minHeight: '60px',
						backgroundColor: '#f7f7f7',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						position: 'fixed',
						margin: 0,
						bottom: 0,
					}}
				>
					<Button variant='contained'>Submit</Button>
				</Box>
			</Drawer>
		</>
	);
}

function BottomNavigationForQuestionView() {
	return (
		<>
			<Box
				sx={{
					width: '100%',
					minHeight: '60px',
					backgroundColor: '#f7f7f7',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'fixed',
					margin: 0,
					bottom: 0,
				}}
			>
				<Box sx={{ paddingLeft: 2, display: 'flex', gap: 2 }}>
					<Button
						variant='outlined'
						sx={{ display: { xs: 'block', md: 'none' } }}
					>
						Review
					</Button>
					<Button
						variant='outlined'
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						Mark for Review
					</Button>
					<Button variant='outlined'>Next</Button>
					<Button
						variant='outlined'
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						Clear Response
					</Button>
				</Box>
				<Box sx={{ paddingRight: 2 }}>
					<Button variant='contained'>Submit and Next</Button>
				</Box>
			</Box>
		</>
	);
}
