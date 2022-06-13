import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import {
	useGetAllUnenrolledCoursesQuery,
	useGetAllEnrolledCoursesQuery,
	useEnrollForAQuizMutation,
} from '../../app/apis/apiSlice';
import { IQuiz } from '../../interfaces/Quiz';

function ExamineeHomePage() {
	const {
		data: { quizzes: enrolledQuizzesList = [] } = {},
		isFetching: isEnrolledQuizApiFetching,
		isError: isEnrolledQuizHavingError,
		error: errorOfEnrolledQuizApi,
		refetch: reFetchEnrolledQuizzesList,
	} = useGetAllEnrolledCoursesQuery('');

	const {
		data: { quizzes: unenrolledQuizzesList = [] } = {},
		isFetching: isUnenrolledQuizApiFetching,
		isError: isUnenrolledQuizHavingError,
		error: errorOfUnenrolledQuizApi,
		refetch: reFetchUnenrolledQuizzesList,
	} = useGetAllUnenrolledCoursesQuery('');

	const [
		shouldShowReloadBtnForEnrolledQuizApiError,
		setShouldShowReloadBtnForEnrolledQuizApiError,
	] = React.useState(true);

	const [
		shouldShowReloadBtnForUnenrolledQuizApiError,
		setShouldShowReloadBtnForUnenrolledQuizApiError,
	] = React.useState(true);

	React.useEffect(() => {
		if (errorOfUnenrolledQuizApi && 'status' in errorOfUnenrolledQuizApi) {
			if (errorOfUnenrolledQuizApi.status === 500)
				setShouldShowReloadBtnForUnenrolledQuizApiError(false);
		}
	}, [isUnenrolledQuizHavingError, errorOfUnenrolledQuizApi]);

	React.useEffect(() => {
		if (errorOfEnrolledQuizApi && 'status' in errorOfEnrolledQuizApi) {
			if (errorOfEnrolledQuizApi.status === 500)
				setShouldShowReloadBtnForEnrolledQuizApiError(false);
		}
	}, [isEnrolledQuizHavingError, errorOfEnrolledQuizApi]);

	const [
		enrollForAQuizHandler,
		{
			isLoading: isEnrollForAQuizReqLoading,
			isError: isEnrollForAQuizReqHavingError,
			error: enrollForAQuizReqError,
		},
	] = useEnrollForAQuizMutation();
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
							Enrolled Quizzes
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
							{isEnrolledQuizApiFetching && (
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
							{!isEnrolledQuizApiFetching &&
								enrolledQuizzesList.map((quiz: IQuiz) => {
									const cardProps =
										enrolledQuizCardViewGenerator(quiz);
									return (
										<React.Fragment key={quiz._id}>
											<Grid item xs={4} md={12}>
												<QuizCard {...cardProps} />
											</Grid>
										</React.Fragment>
									);
								})}
							{!isEnrolledQuizApiFetching &&
								isEnrolledQuizHavingError && (
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
										{shouldShowReloadBtnForEnrolledQuizApiError ? (
											<Button
												variant='outlined'
												endIcon={<ReplayIcon />}
												onClick={
													reFetchEnrolledQuizzesList
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
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={4} md={7}>
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
							{isUnenrolledQuizApiFetching && (
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
							{!isUnenrolledQuizApiFetching &&
								unenrolledQuizzesList.map((quiz: IQuiz) => {
									const cardProps =
										unenrolledQuizCardViewGenerator(
											quiz,
											enrollForAQuizHandler,
										);
									return (
										<React.Fragment key={quiz._id}>
											<Grid item xs={4} md={6}>
												<QuizCard {...cardProps} />
											</Grid>
										</React.Fragment>
									);
								})}
							{!isUnenrolledQuizApiFetching &&
								isUnenrolledQuizHavingError && (
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
										{shouldShowReloadBtnForUnenrolledQuizApiError ? (
											<Button
												variant='outlined'
												endIcon={<ReplayIcon />}
												onClick={
													reFetchUnenrolledQuizzesList
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
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}

export default ExamineeHomePage;

function QuizCard(props: any) {
	const {
		imageUrl,
		cardContainerStyle = {},
		cardContentStyle = {},
		cardContentContent,
		cardActionsStyle = {},
		cardActionsContent,
	} = props;
	return (
		<>
			<Card sx={cardContainerStyle}>
				<CardMedia component='img' height='140' image={imageUrl} />
				<CardContent sx={cardContentStyle}>
					{cardContentContent}
				</CardContent>
				<CardActions sx={cardActionsStyle}>
					{cardActionsContent}
				</CardActions>
			</Card>
		</>
	);
}

function enrolledQuizCardViewGenerator(quiz: IQuiz) {
	const imageUrl = quiz.imageUrl;

	const cardContainerStyle = {
		margin: 2,
	};
	const cardActionsStyle = { justifyContent: 'space-between' };

	const cardContentContent = (
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
		</>
	);
	const cardActionsContent = (
		<>
			<Button>View</Button>
			<Button>Start</Button>
		</>
	);
	return {
		imageUrl,
		cardContainerStyle,
		cardActionsStyle,
		cardContentContent,
		cardActionsContent,
	};
}
function unenrolledQuizCardViewGenerator(
	quiz: IQuiz,
	enrollForAQuizHandler: Function,
) {
	const imageUrl = quiz?.imageUrl;

	const cardContainerStyle = {
		margin: 2,
	};
	const cardActionsStyle = { justifyContent: 'space-between' };

	const enrollForAQuizPayLoad = {
		quizId: quiz._id,
	};
	const cardContentContent = (
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
		</>
	);
	const cardActionsContent = (
		<>
			<Button>View</Button>
			<Button
				onClick={() => enrollForAQuizHandler(enrollForAQuizPayLoad)}
			>
				Enroll
			</Button>
		</>
	);
	return {
		imageUrl,
		cardContainerStyle,
		cardActionsStyle,
		cardContentContent,
		cardActionsContent,
	};
}
