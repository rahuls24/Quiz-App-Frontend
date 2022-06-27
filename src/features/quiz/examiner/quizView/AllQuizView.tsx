import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import QuizzesTable from './QuizzesTable';
import { IQuiz } from '../../../../interfaces/Quiz';
type AllQuizViewProps = {
	isFetching: boolean;
	isError: boolean;
	quizList: IQuiz[];
	shouldShowReloadBtn: boolean;
	reFetchAllQuizList: () => void;
};
export default function AllQuizView(props: AllQuizViewProps) {
	const {
		isFetching,
		isError,
		quizList,
		shouldShowReloadBtn,
		reFetchAllQuizList,
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
				Quizzes Live Now
			</Typography>
			<Divider variant='middle' />
			{isFetching && (
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '75vh',
					}}
				>
					<CircularProgress />
				</Box>
			)}
			{!isFetching && !isError && <QuizzesTable quizzesList={quizList} />}

			{!isFetching && isError && (
				<Box
					sx={{
						width: '100%',
						height: '75vh',
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
							onClick={reFetchAllQuizList}
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
		</>
	);
}
