import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InfoIcon from '@mui/icons-material/Info';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Input = styled(MuiInput)`
	width: 42px;
`;
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: '#f5f5f9',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: '1px solid #dadde9',
	},
}));
type AddQuizInputFieldProps = {
	actionDispatcherForQuizMakerForm: {
		setQuizName: (quizName: string) => void;
		setTopicsForTheQuiz: (quizTitle: string) => void;
		setQuizTime: (time: number) => void;
	};
	quizId: string;
};

export default function AddQuizInputField(props: AddQuizInputFieldProps) {
	const { setQuizName, setTopicsForTheQuiz, setQuizTime } =
		props.actionDispatcherForQuizMakerForm;
	const { quizId } = props;
	const [quizNameInputState, setQuizNameInputState] = React.useState({
		isError: false,
		helperText: '',
		value: '',
	});
	const [topics, setTopics] = React.useState('');
	const quizNameInputHandler = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
	) => {
		const quizName = e.target.value;
		if (quizName.length > 2) {
			setQuizNameInputState(prev => ({
				isError: false,
				helperText: '',
				value: quizName,
			}));
		} else if (quizName.length > 0 && quizName.length <= 2) {
			setQuizNameInputState({
				isError: true,
				helperText: 'Quiz name should be of more than 2 character',
				value: quizName,
			});
		} else {
			setQuizNameInputState({
				isError: true,
				helperText: 'Quiz name is required',
				value: quizName,
			});
		}
		setQuizName(quizName);
	};
	const quizTopicHandler = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
	) => {
		const topics = e.target.value;
		setTopics(topics);
	};
	const [value, setValue] = React.useState<
		number | string | Array<number | string>
	>(30);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		setValue(newValue);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value === '' ? '' : Number(event.target.value));
	};

	const handleBlur = () => {
		if (value < 10) {
			setValue(10);
		} else if (value > 120) {
			setValue(120);
		}
	};
	React.useEffect(() => {
		if (typeof value === 'string' || typeof value === 'number')
			setQuizTime(Number(value));
	}, [value, setQuizTime]);
	return (
		<>
			<Box>
				<TextField
					autoFocus
					required
					margin='normal'
					fullWidth
					id='quizName'
					label='Quiz Name'
					name='quizName'
					placeholder='Enter the Quiz Name'
					error={quizNameInputState.isError}
					helperText={quizNameInputState.helperText}
					onChange={quizNameInputHandler}
					disabled={quizId !== '' ? true : false}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<HtmlTooltip
									title={
										<React.Fragment>
											{quizId !== '' ? (
												<Typography variant='caption'>
													You can not <b>edit</b> this
													after adding any question to
													the <em>quiz</em>
												</Typography>
											) : (
												<Typography variant='caption'>
													This will shown as{' '}
													<b>name</b> of your{' '}
													<em>quiz</em>
												</Typography>
											)}
										</React.Fragment>
									}
								>
									<IconButton
										aria-label='toggle password visibility'
										edge='end'
									>
										<InfoIcon />
									</IconButton>
								</HtmlTooltip>
							</InputAdornment>
						),
					}}
				/>

				<TextField
					margin='normal'
					fullWidth
					name='quizTopics'
					label='Quiz Topics'
					type='text'
					id='quizTopics'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<HtmlTooltip
									title={
										<React.Fragment>
											{quizId !== '' ? (
												<Typography variant='caption'>
													You can not <b>edit</b> this
													after adding any question to
													the <em>quiz</em>
												</Typography>
											) : (
												<Typography variant='caption'>
													You can add{' '}
													<em> multiple topics </em>{' '}
													by adding <b>comma </b>{' '}
													after each topic name.
												</Typography>
											)}
										</React.Fragment>
									}
								>
									<IconButton
										aria-label='toggle password visibility'
										edge='end'
									>
										<InfoIcon />
									</IconButton>
								</HtmlTooltip>
							</InputAdornment>
						),
					}}
					value={topics}
					onChange={quizTopicHandler}
					onBlur={() => setTopicsForTheQuiz(topics)}
					disabled={quizId !== '' ? true : false}
				/>

				<Typography id='input-slider' gutterBottom>
					Total Quiz Time
				</Typography>
				<Grid container spacing={2} alignItems='center'>
					<Grid item>
						<AccessTimeIcon />
					</Grid>
					<Grid item xs>
						<Slider
							value={typeof value === 'number' ? value : 0}
							onChange={handleSliderChange}
							aria-labelledby='input-slider'
							min={10}
							max={120}
							defaultValue={30}
						/>
					</Grid>
					<Grid item>
						<Input
							value={value}
							size='small'
							onChange={handleInputChange}
							onBlur={handleBlur}
							inputProps={{
								step: 5,
								min: 10,
								max: 120,
								type: 'number',
								'aria-labelledby': 'input-slider',
							}}
						/>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
