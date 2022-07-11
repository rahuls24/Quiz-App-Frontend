import React from 'react';
import * as R from 'ramda';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Tooltip from '@mui/material/Tooltip';
import { IQuiz } from '../../interfaces/Quiz';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	setIsQuizDetailsViewOpen,
	setQuizData,
	selectQuizData,
	selectIsQuizDetailsViewOpen,
	setCurrentOnGoingQuiz,
} from './QuizSlice';
import {
	useLazyGetAllQuestionsOfAQuizQuery,
	useEnrollForAQuizMutation,
	useSaveStartTimeMutation,
} from '../../app/apis/apiSlice';
import { getQuestionsData } from '../../shared/functions/quizRelated';
import { IAutoHideAlert } from '../../interfaces/Components';
import { useIsOverflowX } from '../../shared/hooks/useIsOverflow';
import { useNavigate } from 'react-router-dom';
var allEnrolledLoadingBtn = new Set<string>();
export default function QuizCardView(props: QuizCardViewProps) {
	const topicsViewRef = React.useRef();
	const isOverflowInTopicView = useIsOverflowX(topicsViewRef);
	const { quiz, roleOfUser } = props;
	const quizData = useAppSelector(selectQuizData);
	const isQuizDetailsViewOpen = useAppSelector(selectIsQuizDetailsViewOpen);
	const dispatch = useAppDispatch();
	const [
		getAllQuestions,
		{ isFetching: isViewBtnLoading, isError: isErrorInGetAllQuestions },
	] = useLazyGetAllQuestionsOfAQuizQuery();
	const navigate = useNavigate();
	// View Handler
	const viewHandler = async () => {
		try {
			const response = await getAllQuestions(quiz._id);
			let questions = getQuestionsData(response);
			if (questions === undefined)
				throw new Error('Something went wrong');
			const quizDataForDetailedView = {
				quiz,
				questions,
			};
			R.compose(dispatch, setQuizData)(quizDataForDetailedView);
			R.compose(dispatch, setIsQuizDetailsViewOpen)(true);
		} catch (error) {
			// ! Handle this
		}
	};
	const isCurrentQuizOpenedInDetailsView = React.useMemo(() => {
		return (
			isQuizDetailsViewOpen &&
			isCurrentQuizIsViewedInDetailedView(quizData?.quiz?._id, quiz._id)
		);
	}, [quizData?.quiz?._id, quiz._id, isQuizDetailsViewOpen]);

	// Enroll for a quiz handler
	const [enrolledForAQuiz, { isError: isErrorUnenrolledForAQuiz }] =
		useEnrollForAQuizMutation();
	const enrolledForAQuizHandler = async () => {
		if (roleOfUser === 'examiner') return;
		try {
			allEnrolledLoadingBtn.add(quiz._id);
			await enrolledForAQuiz({
				quizId: quiz._id,
			});
			allEnrolledLoadingBtn.delete(quiz._id);
			props.setAlertMsg({
				isOpen: true,
				alertMsg: 'You have enrolled successfully...',
				severity: 'success',
				autoHideDuration: 4000,
			});
		} catch (error) {}
	};
	// Start quiz
	const [saveStartTime] = useSaveStartTimeMutation();

	const startHandler = async () => {
		await Promise.all([
			R.compose(dispatch, setCurrentOnGoingQuiz)(quiz),
			saveStartTime({
				quizId: quiz._id,
			}),
		]);
		navigate(`quiz/start/${quiz._id}`);
	};
	React.useEffect(() => {}, [
		isErrorUnenrolledForAQuiz,
		isErrorInGetAllQuestions,
	]);
	return (
		<>
			<Card
				sx={{ margin: 2 }}
				elevation={isCurrentQuizOpenedInDetailsView ? 24 : 1}
			>
				<CardMedia component='img' height='140' image={quiz.imageUrl} />
				<CardContent>
					<>
						<Typography
							gutterBottom
							variant='h5'
							component='div'
							textAlign={'center'}
							sx={{ textTransform: 'capitalize' }}
						>
							{quiz?.name}
						</Typography>
						<Stack
							direction='row'
							spacing={2}
							justifyContent={
								isOverflowInTopicView ? 'start' : 'center'
							}
							alignItems='center'
							flexWrap={'nowrap'}
							className='thin-scroll'
							rowGap={2}
							overflow={'auto'}
							ref={topicsViewRef}
						>
							{quiz?.topics?.map((topic: string) => {
								return (
									<React.Fragment key={topic}>
										<Chip
											label={`${topic?.toLowerCase()}`}
										/>
									</React.Fragment>
								);
							})}
						</Stack>

						{roleOfUser === 'examiner' && (
							<Box
								sx={{
									marginTop: 2,
									marginBottom: 1,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Tooltip title='Enrolled by'>
									<Button
										variant='outlined'
										startIcon={<PersonOutlineIcon />}
										sx={{ cursor: 'context-menu' }}
										disableRipple
									>
										{quiz?.enrolledBy.length}
									</Button>
								</Tooltip>
							</Box>
						)}
					</>
				</CardContent>
				<CardActions
					sx={{
						justifyContent:
							roleOfUser === 'examinee'
								? 'space-between'
								: 'center',
					}}
				>
					{roleOfUser === 'examinee' ? (
						<>
							{/* Currently I am running out of design for quiz view for examiner so it is disabled */}
							<Button
								onClick={viewHandler}
								disabled={roleOfUser === 'examinee'}
							>
								View
							</Button>
							{props.renderedBy === 'enrolledQuizzes' ? (
								<Button onClick={startHandler}>Start</Button>
							) : (
								<LoadingButton
									loading={allEnrolledLoadingBtn.has(
										quiz._id,
									)}
									onClick={enrolledForAQuizHandler}
								>
									Enroll
								</LoadingButton>
							)}
						</>
					) : (
						<LoadingButton
							loading={isViewBtnLoading}
							onClick={viewHandler}
							disabled={isCurrentQuizOpenedInDetailsView}
						>
							View
						</LoadingButton>
					)}
				</CardActions>
			</Card>
		</>
	);
}
type QuizCardViewProps =
	| {
			quiz: IQuiz;
			roleOfUser: 'examiner';
	  }
	| {
			quiz: IQuiz;
			roleOfUser: 'examinee';
			renderedBy: 'enrolledQuizzes' | 'liveQuizzes';
			setAlertMsg: (payload: IAutoHideAlert) => void;
	  };

//  Util Functions
function isCurrentQuizIsViewedInDetailedView(
	idOfCurrentQuizInDetailedView: string,
	currentQuizId: string,
) {
	return idOfCurrentQuizInDetailedView === currentQuizId;
}
