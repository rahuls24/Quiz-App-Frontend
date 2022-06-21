import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {
	useGetAllUnenrolledCoursesQuery,
	useGetAllEnrolledCoursesQuery,
} from '../../app/apis/apiSlice';
import QuizCard from '../../shared/components/QuizCard';
import { enrolledQuizCardViewGenerator } from '../../shared/functions/quizRelated';
import { IQuiz } from '../../interfaces/Quiz';
import QuizzesTable from './QuizzesTable';
function ExaminerHomePage() {
	const {
		data: { quizzes: myQuizzesList = [] } = {},
		isFetching: isMyQuizzesApiFetching,
		isError: isMyQuizzesHavingError,
		error: errorOfMyQuizzesApi,
		refetch: reFetchMyQuizzesList,
	} = useGetAllEnrolledCoursesQuery(null, {
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const {
		data: { quizzes: allQuizListExcludedMyQuizzesList = [] } = {},
		isFetching: isAllQuizListExcludedMyQuizzesApiFetching,
		isError: isAllQuizListExcludedMyQuizzesHavingError,
		error: errorOfAllQuizListExcludedMyQuizzesApi,
		refetch: reFetchAllQuizListExcludedMyQuizzesList,
	} = useGetAllUnenrolledCoursesQuery(null, {
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const [shouldShowReloadBtns, shouldShowReloadBtnsHandler] = React.useState({
		forMyQuizzesList: true,
		forAllQuizListExcludedMyQuizzesList: true,
	});

	React.useEffect(() => {
		if (
			!isMyQuizzesHavingError &&
			!isAllQuizListExcludedMyQuizzesHavingError
		)
			return;
		let shouldShowReloadBtnsInitialState = {
			forMyQuizzesList: true,
			forAllQuizListExcludedMyQuizzesList: true,
		};
		if (errorOfMyQuizzesApi && 'status' in errorOfMyQuizzesApi) {
			if (errorOfMyQuizzesApi.status === 500)
				shouldShowReloadBtnsInitialState.forMyQuizzesList = false;
		}
		if (
			errorOfAllQuizListExcludedMyQuizzesApi &&
			'status' in errorOfAllQuizListExcludedMyQuizzesApi
		) {
			if (errorOfAllQuizListExcludedMyQuizzesApi.status === 500)
				shouldShowReloadBtnsInitialState.forAllQuizListExcludedMyQuizzesList =
					false;
		}
		shouldShowReloadBtnsHandler(shouldShowReloadBtnsInitialState);
	}, [
		isMyQuizzesHavingError,
		errorOfMyQuizzesApi,
		isAllQuizListExcludedMyQuizzesHavingError,
		errorOfAllQuizListExcludedMyQuizzesApi,
		shouldShowReloadBtnsHandler,
	]);

	React.useEffect(() => {
		reFetchMyQuizzesList();
		reFetchAllQuizListExcludedMyQuizzesList();
	}, [reFetchMyQuizzesList, reFetchAllQuizListExcludedMyQuizzesList]);
	return (
		<>
			<Grid
				container
				columns={{ xs: 4, md: 12 }}
				spacing={1}
				marginTop={1}
				paddingX={1}
			>
				<Grid item xs={4} md={5}>
					<Paper
						sx={{
							minHeight: '85vh',
						}}
						elevation={3}
					>
						<Typography
							variant='h4'
							gutterBottom
							component='div'
							textAlign={'center'}
							paddingTop={1}
						>
							{'My Quizzes'}
						</Typography>
						<Divider variant='middle' />
						<Grid
							container
							columns={{ xs: 4, md: 12 }}
							sx={{
								maxHeight: '75vh',
								minHeight: '75vh',
								overflowY: 'auto',
							}}
							className={'scroll'}
						>
							{isMyQuizzesApiFetching && (
								<Box
									sx={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<CircularProgress />
								</Box>
							)}
							{!isMyQuizzesApiFetching &&
								!isMyQuizzesHavingError &&
								myQuizzesList.map((quiz: IQuiz) => {
									const cardProps =
										enrolledQuizCardViewGenerator(
											quiz,
											'examiner',
										);
									return (
										<React.Fragment key={quiz._id}>
											<Grid item xs={4} md={12}>
												<QuizCard {...cardProps} />
											</Grid>
										</React.Fragment>
									);
								})}
							{!isMyQuizzesApiFetching &&
								isMyQuizzesHavingError && (
									<Box
										sx={{
											width: '100%',
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Typography
											variant='body1'
											gutterBottom
											component='div'
											textAlign={'center'}
											color={'error'}
											sx={{ textTransform: 'capitalize' }}
										>
											{'Unable to fetch all live Quizzes'}
										</Typography>
										{shouldShowReloadBtns.forMyQuizzesList ? (
											<Button
												variant='outlined'
												endIcon={<ReplayIcon />}
												onClick={reFetchMyQuizzesList}
											>
												Reload
											</Button>
										) : (
											<Typography
												variant='button'
												gutterBottom
												component='div'
												textAlign={'center'}
												sx={{
													textTransform: 'capitalize',
												}}
											>
												{'Try After Sometime.....'}
											</Typography>
										)}
									</Box>
								)}
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={4} md={7} >
					<Paper
						sx={{
							minHeight: '85vh',
						}}
						elevation={3}
						className={'scroll'}
					>
						<Typography
							variant='h4'
							gutterBottom
							component='div'
							textAlign={'center'}
							paddingTop={1}
						>
							Quizzes Live Now
						</Typography>
						<Divider variant='middle' />
						{isAllQuizListExcludedMyQuizzesApiFetching && (
							<Box
								sx={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height:'75vh'
								}}
							>
								<CircularProgress />
							</Box>
						)}
						{!isAllQuizListExcludedMyQuizzesApiFetching &&
							!isAllQuizListExcludedMyQuizzesHavingError && (
								<QuizzesTable
									quizzesList={
										allQuizListExcludedMyQuizzesList
									}
								/>
							)}

						{!isAllQuizListExcludedMyQuizzesApiFetching &&
							isAllQuizListExcludedMyQuizzesHavingError && (
								<Box
									sx={{
										width: '100%',
										height:'75vh',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Typography
										variant='body1'
										gutterBottom
										component='div'
										textAlign={'center'}
										color={'error'}
										sx={{ textTransform: 'capitalize' }}
									>
										{'Unable to fetch all live Quizzes'}
									</Typography>
									{shouldShowReloadBtns.forAllQuizListExcludedMyQuizzesList ? (
										<Button
											variant='outlined'
											endIcon={<ReplayIcon />}
											onClick={
												reFetchAllQuizListExcludedMyQuizzesList
											}
										>
											Reload
										</Button>
									) : (
										<Typography
											variant='button'
											gutterBottom
											component='div'
											textAlign={'center'}
											sx={{
												textTransform: 'capitalize',
											}}
										>
											{'Try After Sometime.....'}
										</Typography>
									)}
								</Box>
							)}
					</Paper>
				</Grid>
			</Grid>
			<Fab
				color='primary'
				aria-label='add'
				sx={{
					margin: 0,
					right: 20,
					bottom: 20,
					position: 'fixed',
				}}
			>
				<AddIcon />
			</Fab>
		</>
	);
}

export default ExaminerHomePage;
