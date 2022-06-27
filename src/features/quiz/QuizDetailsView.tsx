import React from 'react';
import * as R from 'ramda';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectQuizData, setIsQuizDetailsViewOpen } from './QuizSlice';
import QuestionsList from './QuestionsList';
import { selectUserDetails } from '../auth/authSlice';
import { useIsOverflowX } from '../../shared/hooks/useIsOverflow';
function QuizDetailsView() {
	const topicViewRef = React.useRef();
	const isTopicViewOverflow = useIsOverflowX(topicViewRef);
	const dispatch = useAppDispatch();
	const quizData = useAppSelector(selectQuizData);
	const { _id: currentUserId = '' } = useAppSelector(selectUserDetails) ?? {};
	const { name: quizName, topics: quizTopics } = quizData.quiz;
	const questions = quizData.questions;
	const isCreatedByUser = React.useMemo(() => {
		return isCreatedByCurrentUser(quizData?.quiz?.createdBy, currentUserId);
	}, [quizData?.quiz?.createdBy, currentUserId]);
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '85vh',
				}}
			>
				<Box>
					<Typography
						variant='h4'
						gutterBottom
						component='div'
						textAlign={'center'}
						paddingTop={1}
					>
						{quizName}
					</Typography>
					<Divider variant='middle' />
					<Box
						sx={{
							maxWidth: '100%',
							backgroundColor: '#f7f7f7',
							minHeight: '55px',
							maxHeight: '40px',
							display: 'flex',
							justifyContent: isTopicViewOverflow
								? 'start'
								: 'center',
							alignItems: 'center',
							overflowX: 'auto',
							columnGap: '10px',
							paddingX: 2,
						}}
						className='scroll'
						ref={topicViewRef}
					>
						{quizTopics.map(topic => {
							return (
								<React.Fragment key={`orderDetails${topic}`}>
									<Chip label={`${topic}`} />
								</React.Fragment>
							);
						})}
					</Box>
				</Box>

				<Box
					sx={{
						maxHeight: '55vh',
						overflowY: 'auto',
					}}
					className='scroll'
				>
					{questions?.map((question, index) => {
						return (
							<React.Fragment key={question._id}>
								<Box
									sx={{
										display: 'flex',
										columnGap: 1,
										padding: 1,
									}}
								>
									<Typography
										variant='h6'
										gutterBottom
										component='div'
									>
										{`Q ${index + 1}.`}
									</Typography>
									<Typography
										variant='h6'
										gutterBottom
										component='div'
									>
										{question.title}
									</Typography>
								</Box>
								<QuestionsList
									options={question.options}
									answers={question.answers}
									isCreatedByUser={isCreatedByUser}
								/>
							</React.Fragment>
						);
					})}
				</Box>
				<Box
					sx={{
						width: '100%',
						minHeight: '40px',
						backgroundColor: '#f7f7f7',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Box sx={{ margin: 1 }}>
						<Tooltip title='Close'>
							<IconButton
								aria-label='close'
								size='large'
								onClick={() =>
									R.compose(
										dispatch,
										setIsQuizDetailsViewOpen,
									)(false)
								}
							>
								<CloseIcon fontSize='large' />
							</IconButton>
						</Tooltip>
					</Box>
					{isCreatedByUser && (
						<Box sx={{ margin: 1 }}>
							<Tooltip title='Edit Quiz'>
								{/* This feature is not part of current MVP */}
								<IconButton
									aria-label='edit'
									size='large'
									disabled
								>
									<EditIcon fontSize='large' />
								</IconButton>
							</Tooltip>
						</Box>
					)}
				</Box>
			</Box>
		</>
	);
}

export default QuizDetailsView;

// Util Functions
function isCreatedByCurrentUser(createdBy: string, userId: string) {
	return createdBy === userId;
}
