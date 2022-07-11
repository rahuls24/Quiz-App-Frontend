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
	isCreatedByUser: boolean;
	questionType: 'singleAnswer' | 'multipleAnswer';
	answers?: string[];
	onChangeHandler?: (value: string, shouldAdd: boolean) => void;
};
export default function QuestionsList(props: QuestionsListProps) {
	const {
		options,
		answers = [],
		isCreatedByUser,
		onChangeHandler,
		questionType,
	} = props;
	return (
		<>
			<List sx={{ width: '100%' }}>
				{options.map((option, index) => {
					const labelId = `checkbox-list-label-${option}`;

					return (
						<ListItem
							key={`option-key-in-question-list-${option}`}
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
							onClick={() => {
								if (!onChangeHandler) return;
								if (questionType === 'multipleAnswer') {
									if (answers.includes(String(index)))
										onChangeHandler(String(index), false);
									else onChangeHandler(String(index), true);
								} else {
									onChangeHandler(String(index), true);
								}
							}}
						>
							<ListItemButton role={undefined} dense>
								<ListItemIcon>
									{questionType === 'multipleAnswer' ? (
										<Checkbox
											edge='start'
											checked={answers.includes(
												String(index),
											)}
											tabIndex={-1}
											disableRipple
											inputProps={{
												'aria-labelledby': labelId,
											}}
											value={option}
											color={'success'}
											onChange={(e, checked) => {
												console.log(
													e.target.value,
													checked,
												);
												if (onChangeHandler)
													onChangeHandler(
														String(index),
														checked,
													);
											}}
										/>
									) : (
										<Radio
											checked={answers.includes(
												String(index),
											)}
											value={option}
											color={'success'}
											// onChange={e => {
											// 	console.log(e.target);
											// 	if (onChangeHandler)
											// 		onChangeHandler(e);
											// }}
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
