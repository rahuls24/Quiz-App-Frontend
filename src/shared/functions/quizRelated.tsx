import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { IQuiz } from '../../interfaces/Quiz';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
export function enrolledQuizCardViewGenerator(quiz: IQuiz, roleOfUser: string) {
	const imageUrl = quiz.imageUrl;

	const cardContainerStyle = {
		margin: 2,
	};
	const cardActionsStyle = {
		justifyContent: roleOfUser === 'examinee' ? 'space-between' : 'center',
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
							{quiz.enrolledBy.length}
						</Button>
					</Tooltip>
				</Box>
			)}
		</>
	);
	const cardActionsContent =
		roleOfUser === 'examinee' ? (
			<>
				<Button>View</Button>
				<Button>Start</Button>
			</>
		) : (
			<Button>View</Button>
		);
	return {
		imageUrl,
		cardContainerStyle,
		cardActionsStyle,
		cardContentContent,
		cardActionsContent,
	};
}
export function unenrolledQuizCardViewGenerator(
	quiz: IQuiz,
	enrollForAQuizHandler: Function,
	currentLoadingEnrollBtns: string[],
	roleOfUser: string,
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
			{roleOfUser === 'examinee' && (
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
							{quiz.enrolledBy.length}
						</Button>
					</Tooltip>
				</Box>
			)}
		</>
	);
	const cardActionsContent = (
		<>
			<Button>View</Button>
			<LoadingButton
				loading={currentLoadingEnrollBtns.includes(
					enrollForAQuizPayLoad.quizId,
				)}
				onClick={() => enrollForAQuizHandler(enrollForAQuizPayLoad)}
			>
				Enroll
			</LoadingButton>
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
