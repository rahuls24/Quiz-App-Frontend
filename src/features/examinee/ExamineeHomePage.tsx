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

// For useReducer
const initialState: ExamineeHomePageLocalState = {
	shouldShowReloadBtnForEnrolledQuizApiError: true,
	shouldShowReloadBtnForUnenrolledQuizApiError: true,
	currentLoadingEnrollBtns: [] as string[],
	quizAlertMsg: {
		isOpen: false,
		alertMsg: '',
		severity: 'error',
		autoHideDuration: 6000,
	},
};

function ExamineeHomePage() {
	const {
		data: { quizzes: enrolledQuizzesList = [] } = {},
		isFetching: isEnrolledQuizApiFetching,
		isError: isEnrolledQuizHavingError,
		error: errorOfEnrolledQuizApi,
		refetch: reFetchEnrolledQuizzesList,
	} = useGetAllEnrolledCoursesQuery(null, {
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});

	const {
		data: { quizzes: unenrolledQuizzesList = [] } = {},
		isFetching: isUnenrolledQuizApiFetching,
		isError: isUnenrolledQuizHavingError,
		error: errorOfUnenrolledQuizApi,
		refetch: reFetchUnenrolledQuizzesList,
	} = useGetAllUnenrolledCoursesQuery(null, {
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});

	const [state, dispatch] = React.useReducer(reducer, initialState);

	React.useEffect(() => {
		if (!isUnenrolledQuizHavingError) return;
		if (errorOfUnenrolledQuizApi && 'status' in errorOfUnenrolledQuizApi) {
			if (errorOfUnenrolledQuizApi.status === 500)
				setShouldShowReloadBtnForUnenrolledQuizApiError(
					dispatch,
					false,
				);
		}
	}, [isUnenrolledQuizHavingError, errorOfUnenrolledQuizApi]);

	React.useEffect(() => {
		if (isEnrolledQuizHavingError) return;
		if (errorOfEnrolledQuizApi && 'status' in errorOfEnrolledQuizApi) {
			if (errorOfEnrolledQuizApi.status === 500)
				setShouldShowReloadBtnForEnrolledQuizApiError(dispatch, false);
		}
	}, [isEnrolledQuizHavingError, errorOfEnrolledQuizApi]);

	const [enrollForAQuizHandler] = useEnrollForAQuizMutation();
	const enrollForAQuizHandlerHelper = async (quizPayload: {
		quizId: string;
	}) => {
		let currentLoadingEnrollBtns = [...state.currentLoadingEnrollBtns];
		currentLoadingEnrollBtns.push(quizPayload.quizId);
		setCurrentLoadingEnrollBtns(dispatch, currentLoadingEnrollBtns);

		try {
			let data = await enrollForAQuizHandler(quizPayload);
			if ('error' in data) {
				throw new Error('Something went wrong while enrolling');
			}
			setQuizAlertMsg(dispatch, {
				isOpen: true,
				alertMsg: 'Enrollment is successful',
				severity: 'success',
				autoHideDuration: 3000,
			});
			currentLoadingEnrollBtns = [...state.currentLoadingEnrollBtns];
			currentLoadingEnrollBtns.shift();
			setCurrentLoadingEnrollBtns(dispatch, currentLoadingEnrollBtns);
		} catch (error) {
			currentLoadingEnrollBtns = [...state.currentLoadingEnrollBtns];
			currentLoadingEnrollBtns.shift();
			setCurrentLoadingEnrollBtns(dispatch, currentLoadingEnrollBtns);

			let currentQuizAlertMsg = { ...state.quizAlertMsg };
			currentQuizAlertMsg.isOpen = true;
			currentQuizAlertMsg.alertMsg =
				'Something went wrong. Try to enroll after sometime';
			currentQuizAlertMsg.severity = 'error';
			currentQuizAlertMsg.autoHideDuration = 4000;
			setQuizAlertMsg(dispatch, currentQuizAlertMsg);
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
										{state.shouldShowReloadBtnForEnrolledQuizApiError ? (
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
											state.currentLoadingEnrollBtns,
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
										{state.shouldShowReloadBtnForUnenrolledQuizApiError ? (
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
				isOpen={state.quizAlertMsg.isOpen}
				alertMsg={state.quizAlertMsg.alertMsg}
				severity={state.quizAlertMsg.severity}
				onCloseHandler={() => {
					let currentQuizAlertMsg = { ...state.quizAlertMsg };
					currentQuizAlertMsg.isOpen = false;
					setQuizAlertMsg(dispatch, currentQuizAlertMsg);
				}}
				autoHideDuration={state.quizAlertMsg.autoHideDuration}
			/>
		</>
	);
}

export default ExamineeHomePage;

// Things related to useReducer
type ExamineeHomePageLocalState = {
	shouldShowReloadBtnForEnrolledQuizApiError: boolean;
	shouldShowReloadBtnForUnenrolledQuizApiError: boolean;
	currentLoadingEnrollBtns: string[];
	quizAlertMsg: IAutoHideAlert;
};

type reducerActionWithBooleanPayload = {
	type:
		| 'SET_RELOAD_BTN_FOR_ENROLLED_QUIZ_API_ERROR'
		| 'SET_RELOAD_BTN_FOR_UNENROLLED_QUIZ_API_ERROR';
	payload: boolean;
};
type reducerActionWithArrOfStrPayload = {
	type: 'SET_CURRENT_LOADING_ENROLL_BTNS';
	payload: string[];
};
type reducerActionWithIAutoHideAlertPayload = {
	type: 'SET_QUIZ_ALERT_MSG';
	payload: IAutoHideAlert;
};
type reducerAction =
	| reducerActionWithBooleanPayload
	| reducerActionWithArrOfStrPayload
	| reducerActionWithIAutoHideAlertPayload;

function reducer(state: ExamineeHomePageLocalState, action: reducerAction) {
	switch (action.type) {
		case 'SET_RELOAD_BTN_FOR_UNENROLLED_QUIZ_API_ERROR':
			return {
				...state,
				shouldShowReloadBtnForEnrolledQuizApiError: action.payload,
			};
		case 'SET_RELOAD_BTN_FOR_ENROLLED_QUIZ_API_ERROR':
			return {
				...state,
				shouldShowReloadBtnForEnrolledQuizApiError: action.payload,
			};
		case 'SET_CURRENT_LOADING_ENROLL_BTNS':
			return {
				...state,
				currentLoadingEnrollBtns: action.payload,
			};
		case 'SET_QUIZ_ALERT_MSG':
			return {
				...state,
				quizAlertMsg: action.payload,
			};
		default:
			return state;
	}
}

function setShouldShowReloadBtnForEnrolledQuizApiError(
	dispatch: React.Dispatch<reducerAction>,
	payload: boolean,
) {
	dispatch({
		type: 'SET_RELOAD_BTN_FOR_ENROLLED_QUIZ_API_ERROR',
		payload,
	});
}

function setShouldShowReloadBtnForUnenrolledQuizApiError(
	dispatch: React.Dispatch<reducerAction>,
	payload: boolean,
) {
	dispatch({
		type: 'SET_RELOAD_BTN_FOR_UNENROLLED_QUIZ_API_ERROR',
		payload,
	});
}

function setQuizAlertMsg(
	dispatch: React.Dispatch<reducerAction>,
	payload: IAutoHideAlert,
) {
	dispatch({
		type: 'SET_QUIZ_ALERT_MSG',
		payload,
	});
}

function setCurrentLoadingEnrollBtns(
	dispatch: React.Dispatch<reducerAction>,
	payload: string[],
) {
	dispatch({
		type: 'SET_CURRENT_LOADING_ENROLL_BTNS',
		payload,
	});
}
