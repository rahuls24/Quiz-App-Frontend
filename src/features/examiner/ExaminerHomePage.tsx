import React from 'react';
import * as R from 'ramda';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {
	useGetAllUnenrolledCoursesQuery,
	useGetAllEnrolledCoursesQuery,
} from '../../app/apis/apiSlice';
import AllQuizView from './components/AllQuizView';
import MyQuizView from './components/MyQuizView';
import QuizDetailsView from '../quiz/QuizDetailsView';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
	selectIsQuizDetailsViewOpen,
	setIsQuizDetailsViewOpen,
} from '../quiz/QuizSlice';
import { useNavigate } from 'react-router-dom';

function ExaminerHomePage() {
	const navigate = useNavigate()
	const {
		data: { quizzes: myQuizzesList = [] } = {},
		isFetching: isMyQuizzesApiFetching,
		isError: isMyQuizzesHavingError,
		error: errorOfMyQuizzesApi,
		refetch: reFetchMyQuizzesList,
	} = useGetAllEnrolledCoursesQuery(null, {
		refetchOnReconnect: true,
	});
	const {
		data: { quizzes: allQuizListExcludedMyQuizzesList = [] } = {},
		isFetching: isAllQuizListExcludedMyQuizzesApiFetching,
		isError: isAllQuizListExcludedMyQuizzesHavingError,
		error: errorOfAllQuizListExcludedMyQuizzesApi,
		refetch: reFetchAllQuizListExcludedMyQuizzesList,
	} = useGetAllUnenrolledCoursesQuery(null, {
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
	const allQuizViewProps = React.useMemo(() => {
		return {
			isFetching: isAllQuizListExcludedMyQuizzesApiFetching,
			isError: isAllQuizListExcludedMyQuizzesHavingError,
			reFetchAllQuizList: reFetchAllQuizListExcludedMyQuizzesList,

			shouldShowReloadBtn:
				shouldShowReloadBtns.forAllQuizListExcludedMyQuizzesList,

			quizList: allQuizListExcludedMyQuizzesList,
		};
	}, [
		isAllQuizListExcludedMyQuizzesApiFetching,
		isAllQuizListExcludedMyQuizzesHavingError,
		reFetchAllQuizListExcludedMyQuizzesList,
		shouldShowReloadBtns.forAllQuizListExcludedMyQuizzesList,
		allQuizListExcludedMyQuizzesList,
	]);
	const myQuizViewProps = React.useMemo(() => {
		return {
			isFetching: isMyQuizzesApiFetching,
			isError: isMyQuizzesHavingError,
			reFetchQuizList: reFetchMyQuizzesList,

			shouldShowReloadBtn: shouldShowReloadBtns.forMyQuizzesList,

			quizList: myQuizzesList,
		};
	}, [
		isMyQuizzesApiFetching,
		isMyQuizzesHavingError,
		reFetchMyQuizzesList,
		shouldShowReloadBtns.forMyQuizzesList,
		myQuizzesList,
	]);

	// For Quiz Details
	const dispatch = useAppDispatch();
	const isQuizDetailsViewOpen = useAppSelector(selectIsQuizDetailsViewOpen);

	React.useEffect(() => {
		return () => {
			R.compose(dispatch, setIsQuizDetailsViewOpen)(false);
		};
	}, [dispatch]);
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
						<MyQuizView {...myQuizViewProps} />
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
						{!isQuizDetailsViewOpen && (
							<>
								<AllQuizView {...allQuizViewProps} />
								<Fab
									color='primary'
									aria-label='add'
									sx={{
										margin: 0,
										right: 20,
										bottom: 20,
										position: 'fixed',
									}}
									onClick={() => navigate('/quiz/make-a-quiz')}
								>
									<AddIcon />
								</Fab>
							</>
						)}
						{isQuizDetailsViewOpen && (
							<>
								<QuizDetailsView />
							</>
						)}
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}

export default ExaminerHomePage;
