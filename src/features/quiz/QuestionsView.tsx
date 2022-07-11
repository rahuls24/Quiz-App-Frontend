import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import QuestionsList from './QuestionsList';
type QuestionsViewForDetailedViewProps = {
	questions: {
		_id: string;
		title: string;
		questionType: 'singleAnswer'| 'multipleAnswer';
		options: string[];
		answers: string[];
	}[];
	isCreatedByUser: boolean;
};
function QuestionsViewForDetailedView(
	props: QuestionsViewForDetailedViewProps,
) {
	const { questions, isCreatedByUser } = props;
	return (
		<>
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
							questionType={question.questionType}
							isCreatedByUser={isCreatedByUser}
						/>
					</React.Fragment>
				);
			})}
		</>
	);
}

export default QuestionsViewForDetailedView;
