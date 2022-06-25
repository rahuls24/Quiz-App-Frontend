import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import { IQuiz } from '../../../interfaces/Quiz';
import QuizCardView from '../../quiz/QuizCardView';
type MyQuizViewProps = {
	isFetching: boolean;
	isError: boolean;
	quizList: IQuiz[];
	shouldShowReloadBtn: boolean;
	reFetchQuizList: () => void;
};
export default function MyQuizView(props: MyQuizViewProps) {
	const {
		isFetching,
		isError,
		quizList,
		shouldShowReloadBtn,
		reFetchQuizList,
	} = props;
	return (
		<>
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
				{isFetching && (
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
				{!isFetching &&
					!isError &&
					quizList.map((quiz: IQuiz) => {
						return (
							<React.Fragment key={quiz._id}>
								<Grid item xs={4} md={12}>
									<QuizCardView
										quiz={quiz}
										roleOfUser={'examiner'}
									/>
								</Grid>
							</React.Fragment>
						);
					})}
				{!isFetching && isError && (
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
						{shouldShowReloadBtn ? (
							<Button
								variant='outlined'
								endIcon={<ReplayIcon />}
								onClick={reFetchQuizList}
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
		</>
	);
}
