import React from 'react';
import * as R from 'ramda';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import addMinutes from 'date-fns/addMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { useGetStartTimeOfTheQuizQuery } from '../../../app/apis/apiSlice';

type startQuizHeaderProps = {
	quizName: string;
	quizId: string;
	quizDuration: number;
	isQuickSelectViewOpen: boolean;
};
function StartQuizHeader(props: startQuizHeaderProps) {
	const { quizName, quizId, quizDuration, isQuickSelectViewOpen } = props;

	const { data: startTimeData, refetch } =
		useGetStartTimeOfTheQuizQuery(quizId);
	const [timer, setTime] = React.useState([0, 0, 0]);
	React.useEffect(() => {
		refetch();
	}, [refetch]);
	React.useEffect(() => {
		const timeIntervalId = setInterval(() => {
			const startedAt = new Date(
				startTimeData?.startTime?.startedAt ?? '',
			);
			const endTime = addMinutes(startedAt, quizDuration);
			const timeDiff = differenceInSeconds(endTime, new Date());
			if (isNaN(timeDiff)) return;
			if (timeDiff < 1) {
				clearInterval(timeIntervalId);
				// Do the submission things
				return;
			}
			R.compose(setTime, getHoursMinsAndSecondsFromSeconds)(timeDiff);
		}, 1000);
		return () => clearInterval(timeIntervalId);
	}, [startTimeData, quizDuration]);
	const hours = timer[0] > 9 ? `${timer[0]}` : `0${timer[0]}`;
	const mins = timer[1] > 9 ? `${timer[1]}` : `0${timer[1]}`;
	const seconds = timer[2] > 9 ? `${timer[2]}` : `0${timer[2]}`;
	return (
		<>
			<AppBar position='static' color='transparent'>
				<Container maxWidth='xl'>
					<Toolbar
						disableGutters
						sx={{
							justifyContent: 'space-between',
							display: { xs: 'none', md: 'flex' },
						}}
					>
						<Typography variant='h6' component='div'>
							{quizName}
						</Typography>
						<Typography
							variant='button'
							gutterBottom
							component='div'
							sx={{
								marginRight:
									isQuickSelectViewOpen === true
										? '240px'
										: '0px',
							}}
						>
							{`${hours} : ${mins} : ${seconds}`}
						</Typography>
					</Toolbar>
					<Toolbar
						disableGutters
						sx={{
							justifyContent:
								isQuickSelectViewOpen === true
									? 'start'
									: 'center',
							display: { xs: 'flex', md: 'none' },
						}}
					>
						<Typography
							variant='button'
							gutterBottom
							component='div'
						>
							{`${hours} : ${mins} : ${seconds}`}
						</Typography>
					</Toolbar>
					<Divider
						variant='fullWidth'
						sx={{
							display: { xs: 'block', md: 'none' },
						}}
					/>
					<Toolbar
						disableGutters
						sx={{
							display: { xs: 'flex', md: 'none' },
							width: '100%',
						}}
					>
						<Typography
							variant='h6'
							component='div'
							align={
								isQuickSelectViewOpen === true
									? 'left'
									: 'center'
							}
							sx={{ width: '100%' }}
						>
							{quizName}
						</Typography>
					</Toolbar>
				</Container>
			</AppBar>
		</>
	);
}
export default StartQuizHeader;
function getHoursMinsAndSecondsFromSeconds(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	seconds -= 3600 * hours;
	const mins = Math.floor(seconds / 60);
	seconds -= 60 * mins;
	return [hours, mins, seconds];
}
