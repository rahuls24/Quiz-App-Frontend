import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
function QuizCard(props: any) {
	const {
		imageUrl,
		cardContainerStyle = {},
		cardContentStyle = {},
		cardContentContent,
		cardActionsStyle = {},
		cardActionsContent,
	} = props;
	return (
		<>
			<Card sx={cardContainerStyle}>
				<CardMedia component='img' height='140' image={imageUrl} />
				<CardContent sx={cardContentStyle}>
					{cardContentContent}
				</CardContent>
				<CardActions sx={cardActionsStyle}>
					{cardActionsContent}
				</CardActions>
			</Card>
		</>
	);
}

export default QuizCard;
