import * as React from 'react';
import * as R from 'ramda';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IQuiz, IQuizRow } from '../../interfaces/Quiz';
import { IQuizzesTableProps } from '../../interfaces/Components';
import { QuizzesMappingWithIndex } from '../../types/Quiz';
import { useLazyGetAllQuestionsOfAQuizQuery } from '../../app/apis/apiSlice';
import { useAppDispatch } from '../../app/hooks';
import { setIsQuizDetailsViewOpen, setQuizData } from '../quiz/QuizSlice';
import { getQuestionsData } from '../../shared/functions/quizRelated';
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
	},
	{
		field: 'enrolledBy',
		headerName: 'Enrolled By',
		type: 'number',
		width: 150,
	},
];

export default function QuizzesTable(props: IQuizzesTableProps) {
	const { quizzesList } = props;
	let [rows, quizzesMappingWithRowIndex] = createRows(quizzesList);
	const dispatch = useAppDispatch();
	const [getAllQuestions, { isFetching: isViewBtnLoading }] =
		useLazyGetAllQuestionsOfAQuizQuery();
	const viewHandler = async (quiz: IQuiz) => {
		try {
			const response = await getAllQuestions(quiz._id);
			let questions = getQuestionsData(response);
			if (questions === undefined)
				throw new Error('Something went wrong');
			const quizDataForDetailedView = {
				quiz,
				questions,
			};
			R.compose(dispatch, setQuizData)(quizDataForDetailedView);
			R.compose(dispatch, setIsQuizDetailsViewOpen)(true);
		} catch (error) {
			// ! Handle this
		}
	};
	return (
		<>
			<Box sx={{ height: '63vh', width: '99%', paddingLeft: '1%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
					disableSelectionOnClick
					// TODO: handle this
					onRowClick={e => {
						if ('id' in e.row) {
							viewHandler(
								quizzesMappingWithRowIndex[String(e.row.id)],
							);
							console.log(
								quizzesMappingWithRowIndex[String(e.row.id)][
									'_id'
								],
							);
						}
					}}
				/>
			</Box>
		</>
	);
}

function createRows(
	quizzes: Array<IQuiz>,
): [Array<IQuizRow>, QuizzesMappingWithIndex] {
	let rows = [] as Array<IQuizRow>;
	let Map: QuizzesMappingWithIndex = {};
	quizzes.forEach((quiz: IQuiz, index: number) => {
		let row = {
			id: index + 1,
			quizName: quiz.name,
			topics: quiz.topics.join(','),
			enrolledBy: quiz.enrolledBy.length,
		};
		rows.push(row);
		Map[String(index + 1)] = quiz;
	});
	return [rows, Map];
}
