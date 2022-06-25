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
} from './QuizSlice';
import { useLazyGetAllQuestionsOfAQuizQuery } from '../../app/apis/apiSlice';
import { getQuestionsData } from '../../shared/functions/quizRelated';

export default function QuizCardView(props: QuizCardViewProps) {
	const { quiz, roleOfUser } = props;
	const quizData = useAppSelector(selectQuizData);
	const isQuizDetailsViewOpen = useAppSelector(selectIsQuizDetailsViewOpen);
	const dispatch = useAppDispatch();
	const [getAllQuestions, { isFetching: isViewBtnLoading }] =
		useLazyGetAllQuestionsOfAQuizQuery();
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
	return (
		<>
			<Card sx={{ margin: 2 }}>
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
							justifyContent='center'
							alignItems='center'
							flexWrap={'wrap'}
							className='scroll'
							rowGap={2}
						>
							{quiz?.topics?.map((topic: string) => {
								return (
									<React.Fragment key={topic}>
										<Chip
											label={`${topic?.toLowerCase()}`}
											sx={{ cursor: 'pointer' }}
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
							<Button onClick={viewHandler}>View</Button>
							{props.renderedBy === 'enrolledQuizzes' ? (
								<Button>Start</Button>
							) : (
								<LoadingButton
									loading={props.currentLoadingEnrollBtns.includes(
										quiz._id,
									)}
									onClick={() =>
										props.enrollForAQuizHandler({
											quizId: quiz._id,
										})
									}
								>
									Enroll
								</LoadingButton>
							)}
						</>
					) : (
						<LoadingButton
							loading={isViewBtnLoading}
							onClick={viewHandler}
							disabled={
								quizData?.quiz?._id === quiz._id &&
								isQuizDetailsViewOpen
							}
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
			renderedBy: 'enrolledQuizzes';
	  }
	| {
			quiz: IQuiz;
			roleOfUser: 'examinee';
			renderedBy: 'liveQuizzes';
			enrollForAQuizHandler: Function;
			currentLoadingEnrollBtns: string[];
	  };

