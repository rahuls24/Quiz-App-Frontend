import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
type QuestionsListProps = {
	options: string[];
	answers: string[];
	isCreatedByUser: boolean;
};
export default function QuestionsList(props: QuestionsListProps) {
	const { options, answers, isCreatedByUser } = props;
	return (
		<>
			<List sx={{ width: '100%' }}>
				{options.map((option, index) => {
					const labelId = `checkbox-list-label-${option}`;

					return (
						<ListItem
							key={option}
							secondaryAction={
								// This btn is disabled because edit option is not part of MVP
								isCreatedByUser ? (
									<IconButton
										edge='end'
										aria-label='comments'
										disabled
									>
										<EditIcon />
									</IconButton>
								) : null
							}
							disablePadding
						>
							<ListItemButton role={undefined} dense>
								<ListItemIcon>
									{answers.length > 1 ? (
										<Checkbox
											edge='start'
											checked={
												answers.includes(
													String(index),
												) && isCreatedByUser
											}
											tabIndex={-1}
											disableRipple
											inputProps={{
												'aria-labelledby': labelId,
											}}
											color={'success'}
											disabled
										/>
									) : (
										<Radio
											checked={
												answers.includes(
													String(index),
												) && isCreatedByUser
											}
											color={'success'}
											disabled
										/>
									)}
								</ListItemIcon>
								<ListItemText
									id={labelId}
									primary={`${option}`}
								/>
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</>
	);
}
