import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { useSaveAQuizMutation } from '../app/apis/apiSlice';
import Save from '@mui/material/DialogTitle';
import AddQuizInputField from '../features/examiner/QuizMaker/AddQuizInputField';
import ConfirmQuizPopup from '../features/examiner/QuizMaker/ConfirmQuizPopupProps';
import { Question } from '../types/Quiz';
import QuestionsView from '../features/examiner/QuizMaker/QuestionsView';
import LoadingButton from '@mui/lab/LoadingButton';
import AutoHideAlert from '../shared/components/AutoHideAlert';
import { IAutoHideAlert } from '../interfaces/Components';
// --------------------------Import Ended----------------------------------------

type QuizMakerForm = {
	quizName: string;
	quizId: string;
	topics: string;
	questions: Question[];
};
const quizMakerFormInitialState: QuizMakerForm = {
	quizName: '',
	topics: '',
	quizId: '',
	questions: [] as Question[],
};

function QuizMakerPage() {
	const [saveAQuiz, { isError, isSuccess, isLoading }] =
		useSaveAQuizMutation();
	const [isQuizSaveConfirmationPopupOpen, setQuizSaveConfirmationPopupOpen] =
		React.useState(false);
	const [autoHideAlertProps, setAutoHideAlertProps] =
		React.useState<IAutoHideAlert>({
			isOpen: false,
			alertMsg: '',
			severity: 'error',
			autoHideDuration: 6000,
		});
	const [quizMakerFormState, quizMakerFormDispatch] = React.useReducer(
		quizMakerReducer,
		quizMakerFormInitialState,
	);
	const actionDispatcherForQuizMakerForm = React.useMemo(() => {
		return actionCreatorForQuizMakerForm(quizMakerFormDispatch);
	}, []);
	const addQuestionHandler = () => {
		// It means quiz is already save in db. Now we have add new question
		if (quizMakerFormState.quizId !== '') {
			let newQuestion = {
				title: '',
				options: ['', ''],
				correctAnswers: [] as number[],
			};
			let updateQuestionsListPayload = {
				updatedQuestion: newQuestion,
				index: quizMakerFormState.questions.length,
			};
			actionDispatcherForQuizMakerForm.updateQuestionsList(
				updateQuestionsListPayload,
			);
			return;
		} else {
			setQuizSaveConfirmationPopupOpen(true);
		}
	};
	const saveQuizHandler = async () => {
		const saveAQuizPayload = {
			name: quizMakerFormState.quizName,
			topics:
				quizMakerFormState.topics === ''
					? 'misc'
					: quizMakerFormState.topics,
		};
		const quizData = await saveAQuiz(saveAQuizPayload);
		if (quizData && 'error' in quizData) return;
		if (!quizData.data?.quiz?._id) return;
		actionDispatcherForQuizMakerForm.setQuizId(quizData.data?.quiz?._id);
		const firstQuestion: Question = {
			title: '',
			options: ['', ''],
			correctAnswers: [] as number[],
		};
		const updateQuestionsListPayload = {
			updatedQuestion: firstQuestion,
			index: 0,
		};
		actionDispatcherForQuizMakerForm.updateQuestionsList(
			updateQuestionsListPayload,
		);
	};

	//! useEffect ---
	// For manipulating autoHideAlertProps
	React.useEffect(() => {
		if (isSuccess) {
			setAutoHideAlertProps({
				isOpen: true,
				alertMsg: 'Quiz name and topics are saved successfully',
				severity: 'success',
				autoHideDuration: 4000,
			});
			return;
		}
		if (isError) {
			setAutoHideAlertProps({
				isOpen: true,
				alertMsg: 'Something went wrong. Please try again',
				severity: 'error',
				autoHideDuration: 4000,
			});
			return;
		}
	}, [isError, isSuccess]);
	return (
		<>
			<Container component='main' maxWidth='md'>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 3,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography component='h1' variant='h5'>
						{'Create an awesome quiz in minutes'}
					</Typography>
					<Paper
						elevation={3}
						sx={{ marginTop: 5, minWidth: '100%', padding: 2 }}
					>
						<AddQuizInputField
							actionDispatcherForQuizMakerForm={
								actionDispatcherForQuizMakerForm
							}
							quizId={quizMakerFormState.quizId}
						/>
						{quizMakerFormState.questions.map(
							(question, index, questionsList) => {
								return (
									<React.Fragment
										key={`${question.title}${index}`}
									>
										<Box sx={{ marginY: 2 }}>
											<Divider variant='middle'>
												{' '}
												{`Question No ${
													index + 1
												}`}{' '}
											</Divider>
										</Box>
										<QuestionsView
											questionIndex={index}
											question={question}
											updateQuestionsList={
												actionDispatcherForQuizMakerForm.updateQuestionsList
											}
										/>
									</React.Fragment>
								);
							},
						)}
						<Grid container columns={{ xs: 4, md: 12 }}>
							{quizMakerFormState.quizName.length < 3 ||
							quizMakerFormState.questions.length <= 0 ? (
								<Grid item xs={4} md={12}>
									<LoadingButton
										loading={isLoading ? true : false}
										fullWidth
										loadingPosition='end'
										endIcon={<AddIcon />}
										variant='contained'
										onClick={addQuestionHandler}
										disabled={
											quizMakerFormState.quizName.length <
											3
												? true
												: false
										}
										sx={{ marginTop: 1 }}
									>
										{'Add Question'}
									</LoadingButton>
								</Grid>
							) : (
								<>
									<Grid item xs={4} md={8}>
										<Button
											variant='contained'
											fullWidth
											endIcon={<AddIcon />}
											onClick={addQuestionHandler}
											disabled={
												quizMakerFormState.quizName
													.length < 3
													? true
													: false
											}
											sx={{
												marginTop: 1,
											}}
										>
											{'Add Question'}
										</Button>
									</Grid>
									<Grid
										item
										xs={0}
										md={1}
										sx={{
											display: {
												xs: 'none',
												sm: 'block',
											},
										}}
									></Grid>
									<Grid item xs={4} md={3}>
										<Button
											variant='contained'
											fullWidth
											endIcon={<Save />}
											sx={{ marginTop: 1 }}
											color='success'
											disabled={
												quizMakerFormState.questions[0]
													.title === ''
													? true
													: false
											}
										>
											Save Quiz
										</Button>
									</Grid>
								</>
							)}
						</Grid>
					</Paper>
				</Box>
			</Container>
			<ConfirmQuizPopup
				open={isQuizSaveConfirmationPopupOpen}
				setOpen={setQuizSaveConfirmationPopupOpen}
				onConfirmHandler={saveQuizHandler}
			/>
			<AutoHideAlert
				onCloseHandler={() =>
					setAutoHideAlertProps({
						...autoHideAlertProps,
						isOpen: false,
					})
				}
				{...autoHideAlertProps}
			/>
		</>
	);
}

export default QuizMakerPage;

// For Reducer Start
type QuizMakerFormActionWithStringPayload = {
	type:
		| 'SET_QUIZ_NAME'
		| 'SET_TOPICS_OF_THE_QUIZ'
		| 'SET_QUIZ_ID_OF_THE_QUIZ';
	payload: string;
};

type QuizMakerFormActionWithQuestionTypePayload = {
	type: 'UPDATE_QUESTION_OF_QUESTIONS_LIST';
	payload: {
		updatedQuestion: Question;
		index: number;
	};
};

type QuizMakerFormAction =
	| QuizMakerFormActionWithStringPayload
	| QuizMakerFormActionWithQuestionTypePayload;

function quizMakerReducer(state: QuizMakerForm, action: QuizMakerFormAction) {
	switch (action.type) {
		case 'SET_QUIZ_NAME':
			return { ...state, quizName: action.payload };
		case 'SET_TOPICS_OF_THE_QUIZ':
			return { ...state, topics: action.payload };
		case 'SET_QUIZ_ID_OF_THE_QUIZ':
			return { ...state, quizId: action.payload };
		case 'UPDATE_QUESTION_OF_QUESTIONS_LIST':
			const currentQuestionsList = state.questions;
			currentQuestionsList[action.payload.index] =
				action.payload.updatedQuestion;
			return { ...state, questions: currentQuestionsList };
		default:
			return state;
	}
}

function actionCreatorForQuizMakerForm(
	dispatch: React.Dispatch<QuizMakerFormAction>,
) {
	function setQuizName(quizName: string) {
		return dispatch({ type: 'SET_QUIZ_NAME', payload: quizName });
	}
	function setTopicsForTheQuiz(quizTitle: string) {
		dispatch({ type: 'SET_TOPICS_OF_THE_QUIZ', payload: quizTitle });
	}
	function setQuizId(quizId: string) {
		dispatch({ type: 'SET_QUIZ_ID_OF_THE_QUIZ', payload: quizId });
	}
	function updateQuestionsList(questionsList: {
		updatedQuestion: Question;
		index: number;
	}) {
		dispatch({
			type: 'UPDATE_QUESTION_OF_QUESTIONS_LIST',
			payload: questionsList,
		});
	}
	return {
		setQuizName,
		setTopicsForTheQuiz,
		setQuizId,
		updateQuestionsList,
	};
}
// For Reducer Ended
