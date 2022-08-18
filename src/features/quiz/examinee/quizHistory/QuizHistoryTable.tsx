import NoQuizInHistoryTable from '@Feature/quiz/NoQuizInHistoryTable';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { calculateAccuracy } from '@SharedFunction/quizRelated';
import { QuizzesHistory } from '@Type/Quiz';
import { useCallback, useMemo } from 'react';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'NO',
        width: 90,
        hideable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'quizName',
        headerName: 'Quiz Name',
        width: 200,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'numberOfRightAnswers',
        headerName: 'Correct',
        width: 120,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'numberOfWrongAnswers',
        headerName: 'Wrong',
        type: 'number',
        width: 120,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'numberSkippedQuestions',
        headerName: 'Skipped',
        type: 'number',
        width: 120,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'totalTimeTaken',
        headerName: 'Time Taken',
        type: 'number',
        width: 120,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'accuracy',
        headerName: 'Accuracy',
        type: 'number',
        width: 120,
        headerAlign: 'center',
        align: 'center',
    },
];

type QuizHistoryTableProps = {
    quizzesHistoryData: Array<QuizzesHistory>;
    isLoading: boolean;
};
function QuizHistoryTable(props: QuizHistoryTableProps) {
    const { quizzesHistoryData, isLoading } = props;
    const rows = useMemo(() => {
        return createRows(quizzesHistoryData);
    }, [quizzesHistoryData]);
    const NoContentInTheTable = useCallback(() => {
        return (
            <NoQuizInHistoryTable content={<NoQuizInHistoryTableContent />} />
        );
    }, []);
    return (
        <>
            <Box>
                <Typography
                    sx={{ width: '100%', marginTop: 4 }}
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="div"
                >
                    Quizzes History
                </Typography>
                <Paper sx={{ height: '63vh' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        loading={isLoading}
                        components={{
                            NoRowsOverlay: NoContentInTheTable,
                        }}
                    />
                </Paper>
            </Box>
        </>
    );
}

export default QuizHistoryTable;

type QuizHistoryRow = {
    id: number;
    quizName: string;
    numberOfRightAnswers: number;
    numberOfWrongAnswers: number;
    numberSkippedQuestions: number;
    totalTimeTaken: number;
    accuracy: string;
};
// Util Functions
function createRows(quizzesHistory: Array<QuizzesHistory>) {
    const quizHistoryRowData = [] as Array<QuizHistoryRow>;
    quizzesHistory.forEach((quizData, index) => {
        const {
            quizName,
            quizResult: {
                numberOfRightAnswers,
                numberOfWrongAnswers,
                numberSkippedQuestions,
                totalTimeTaken,
            },
        } = quizData;
        const accuracy = `${calculateAccuracy(
            numberOfRightAnswers,
            numberOfWrongAnswers
        )}%`;
        quizHistoryRowData.push({
            id: index + 1,
            quizName,
            numberOfRightAnswers,
            numberOfWrongAnswers,
            numberSkippedQuestions,
            totalTimeTaken,
            accuracy,
        });
    });

    return quizHistoryRowData;
}
function NoQuizInHistoryTableContent() {
    return (
        <>
            <Typography variant="h6" gutterBottom component="div">
                No Quiz found
            </Typography>
            <Typography variant="body2" gutterBottom>
                Try to attempt a quiz. You can track that quiz result here.
            </Typography>
        </>
    );
}
