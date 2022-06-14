import React from 'react';
// MUI import
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
// Components import
import AutoHideAlert from '../../shared/components/AutoHideAlert';
import QuizCard from '../../shared/components/QuizCard';
// interfaces import
import { IQuiz } from '../../interfaces/Quiz';
import { IAutoHideAlert } from '../../interfaces/Components';
// Util function import
import {
	enrolledQuizCardViewGenerator,
	unenrolledQuizCardViewGenerator,
} from '../../shared/functions/quizRelated';
//  Redux toolkit related import
import {
	useGetAllUnenrolledCoursesQuery,
	useGetAllEnrolledCoursesQuery,
	useEnrollForAQuizMutation,
} from '../../app/apis/apiSlice';

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

	const [enrollForAQuizHandler] = useEnrollForAQuizMutation();
	const [quizAlertMsg, setQuizAlertMsg] = React.useState<IAutoHideAlert>({
		isOpen: false,
		alertMsg: '',
		severity: 'error',
		autoHideDuration: 6000,
	});
	const [currentLoadingEnrollBtns, setCurrentLoadingEnrollBtns] =
		React.useState([] as string[]);

	const enrollForAQuizHandlerHelper = async (quizPayload: any) => {
		setCurrentLoadingEnrollBtns(prev => [...prev, quizPayload.quizId]);
		try {
			let data = await enrollForAQuizHandler(quizPayload);
			if ('error' in data) {
				throw new Error('Something went wrong while enrolling');
			}
			setQuizAlertMsg({
				isOpen: true,
				alertMsg: 'Enrollment is successful',
				severity: 'success',
				autoHideDuration: 3000,
			});
			setCurrentLoadingEnrollBtns(prev => {
				const currentState = [...prev];
				currentState.shift();
				return currentState;
			});
		} catch (error) {
			setCurrentLoadingEnrollBtns(prev => {
				const currentState = [...prev];
				currentState.shift();
				return currentState;
			});
			setQuizAlertMsg(prev => {
				const currentState = prev;
				currentState.isOpen = true;
				currentState.alertMsg =
					'Something went wrong. Try to enroll after sometime';
				currentState.severity = 'error';
				currentState.autoHideDuration = 4000;
				return currentState;
			});
		}
	};
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
										enrolledQuizCardViewGenerator(
											quiz,
											'examinee',
										);
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
											enrollForAQuizHandlerHelper,
											currentLoadingEnrollBtns,
											'examinee',
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
			<AutoHideAlert
				isOpen={quizAlertMsg.isOpen}
				alertMsg={quizAlertMsg.alertMsg}
				severity={quizAlertMsg.severity}
				onCloseHandler={() =>
					setQuizAlertMsg(prev => ({ ...prev, isOpen: false }))
				}
				autoHideDuration={quizAlertMsg.autoHideDuration}
			/>
		</>
	);
}

export default ExamineeHomePage;
