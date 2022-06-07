import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
function ExamineeHomePage() {
	return (
		<>
			<Grid
				container
				columns={{ xs: 4, md: 12 }}
				spacing={1}
				marginTop={1}
			>
				<Grid item xs={4} md={5}>
					<Paper sx={{ minHeight: '88vh' }} elevation={3}>
						<Typography
							variant='h4'
							gutterBottom
							component='div'
							textAlign={'center'}
							paddingTop={1}
						>
							Enrolled Quizzes
						</Typography>
						<Divider variant='middle' />
					</Paper>
				</Grid>
				<Grid item xs={4} md={7}>
					<Paper sx={{ minHeight: '88vh' }} elevation={3}>
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
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}

export default ExamineeHomePage;
