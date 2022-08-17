import NoQuizInHistoryTable from '@Feature/quiz/NoQuizInHistoryTable';
import { setIsQuizDetailsViewOpen, setQuizData } from '@Feature/quiz/QuizSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useLazyGetAllQuestionsOfAQuizQuery } from '@ReduxStore/apis/apiSlice';
import { useAppDispatch } from '@ReduxStore/hooks';
import { getQuestionsData } from '@SharedFunction/quizRelated';
import { Quiz, QuizRow, QuizzesMappingWithIndex } from '@Type/Quiz';
import * as R from 'ramda';
import React from 'react';
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

type QuizzesTableProps = {
    quizzesList: Array<Quiz>;
};

export default function QuizzesTable(props: QuizzesTableProps) {
    const { quizzesList } = props;
    let [rows, quizzesMappingWithRowIndex] = createRows(quizzesList);
    const dispatch = useAppDispatch();
    const [getAllQuestions, { isFetching: isViewBtnLoading }] =
        useLazyGetAllQuestionsOfAQuizQuery();
    const NoContentInTheTable = React.useCallback(() => {
        return (
            <NoQuizInHistoryTable
                content={<NoQuizInLiveQuizzesTableContent />}
            />
        );
    }, []);
    const viewHandler = async (quiz: Quiz) => {
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
                    onRowClick={(e) => {
                        if ('id' in e.row) {
                            viewHandler(
                                quizzesMappingWithRowIndex[String(e.row.id)]
                            );
                        }
                    }}
                    loading={false}
                    components={{
                        NoRowsOverlay: NoContentInTheTable,
                    }}
                />
            </Box>
        </>
    );
}

function createRows(
    quizzes: Array<Quiz>
): [Array<QuizRow>, QuizzesMappingWithIndex] {
    let rows = [] as Array<QuizRow>;
    let Map: QuizzesMappingWithIndex = {};
    quizzes.forEach((quiz: Quiz, index: number) => {
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

function NoQuizInLiveQuizzesTableContent() {
    return (
        <>
            <Typography variant="h6" gutterBottom component="div">
                No Quiz found
            </Typography>
            <Typography variant="body2" gutterBottom>
                When another examiner adds a quiz, it will appear here.
            </Typography>
        </>
    );
}
