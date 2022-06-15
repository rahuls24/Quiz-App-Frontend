import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// TODO: Work to remove any in props type
export default function Copyright(props: any) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}
		>
			{'Copyright © '}
			<Link color='inherit' href='#'>
				Quiz App
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}
