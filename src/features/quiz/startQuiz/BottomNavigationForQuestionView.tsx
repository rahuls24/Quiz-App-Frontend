import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
type BottomNavigationForQuestionViewProps = {
	updateAnswer: (action: string, value?: string) => void;
	isQuickSelectViewOpen: boolean;
};
export default function BottomNavigationForQuestionView(
	props: BottomNavigationForQuestionViewProps,
) {
	const { updateAnswer, isQuickSelectViewOpen } = props;
	return (
		<>
			<Box
				sx={{
					width: '100%',
					minHeight: '60px',
					backgroundColor: '#f7f7f7',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'fixed',
					margin: 0,
					bottom: 0,
				}}
			>
				<Box sx={{ paddingLeft: 2, display: 'flex', gap: 2 }}>
					<Button
						variant='outlined'
						sx={{ display: { xs: 'block', md: 'none' } }}
						onClick={() => updateAnswer('markAsReview')}
					>
						Review
					</Button>
					<Button
						variant='outlined'
						sx={{ display: { xs: 'none', md: 'block' } }}
						onClick={() => updateAnswer('markAsReview')}
					>
						Mark for Review
					</Button>
					<Button
						variant='outlined'
						onClick={() => updateAnswer('next')}
					>
						Next
					</Button>
					<Button
						variant='outlined'
						sx={{ display: { xs: 'none', md: 'block' } }}
						onClick={() => updateAnswer('clearResponse')}
					>
						Clear Response
					</Button>
				</Box>
				<Box
					sx={{
						paddingRight: 2,
						marginRight:
							isQuickSelectViewOpen === true ? '240px' : '0px',
					}}
				>
					<Button
						variant='contained'
						onClick={() => updateAnswer('saveAndNext')}
					>
						Save and Next
					</Button>
				</Box>
			</Box>
		</>
	);
}
