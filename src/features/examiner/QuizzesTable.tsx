import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IQuiz } from '../../interfaces/Quiz';
const columns: GridColDef[] = [
	{ field: 'id', headerName: 'NO', width: 90, hideable: false },
	{
		field: 'quizName',
		headerName: 'Quiz Name',
		width: 150,
	},
	{
		field: 'topics',
		headerName: 'Topics',
		width: 150,
		resizable: true,
	},
	{
		field: 'enrolledBy',
		headerName: 'Enrolled By',
		type: 'number',
		width: 150,
	},
];

export default function QuizzesTable(props: any) {
	const { quizzesList } = props;
	let rows = createRows(quizzesList ?? []);

	return (
		<>
			<Box sx={{ height: '63vh', width: '100%',paddingLeft:'1%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
					disableSelectionOnClick
					onRowClick={() => console.log(99)}
                    
				/>
			</Box>
		</>
	);
}

function createRows(quizzes: any) {
	let rows: any = [];
	quizzes.forEach((quiz: IQuiz, index: number) => {
		let row = {
			id: index+1,
			quizName: quiz.name,
			topics: quiz.topics.join(','),
			enrolledBy: quiz.enrolledBy.length,
		};
		rows.push(row);
	});
	return rows;
}
