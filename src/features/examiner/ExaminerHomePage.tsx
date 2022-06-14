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
	} = useGetAllEnrolledCoursesQuery('');
	const {
		data: { quizzes: allQuizListExcludedMyQuizzesList = [] } = {},
		isFetching: isAllQuizListExcludedMyQuizzesApiFetching,
		isError: isAllQuizListExcludedMyQuizzesHavingError,
		error: errorOfAllQuizListExcludedMyQuizzesApi,
		refetch: reFetchAllQuizListExcludedMyQuizzesList,
	} = useGetAllUnenrolledCoursesQuery('');
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
							{!isMyQuizzesApiFetching &&
								myQuizzesList.map((quiz: IQuiz) => {
									const cardProps =
										enrolledQuizCardViewGenerator(quiz,'examiner');
									return (
										<React.Fragment key={quiz._id}>
											<Grid item xs={4} md={12}>
												<QuizCard {...cardProps} />
											</Grid>
										</React.Fragment>
									);
								})}
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
						<QuizzesTable quizzesList={allQuizListExcludedMyQuizzesList} />
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
