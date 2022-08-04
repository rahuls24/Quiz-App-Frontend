import { selectCurrentOnGoingQuizQuestions } from '@Feature/quiz/QuizSlice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAppSelector } from '@ReduxStore/hooks';
import { QuestionOfCurrentOngoingQuiz } from '@Type/Quiz';

export default function QuestionsDetailsTable() {
    const questionsList = useAppSelector(selectCurrentOnGoingQuizQuestions);
    const [
        totalQuestions,
        answeredQuestions,
        markedAsReviewQuestions,
        notAnsweredQuestions,
        skippedQuestions,
    ] = getTableRowDetails(questionsList);
    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Total Questions</TableCell>
                        <TableCell align="center">Answered</TableCell>
                        <TableCell align="center">Not Answered</TableCell>
                        <TableCell align="center">Mark for Review</TableCell>
                        <TableCell align="center">Not Visited</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        sx={{
                            '&:last-child td, &:last-child th': {
                                border: 0,
                            },
                        }}
                    >
                        <TableCell component="th" scope="row" align="center">
                            {totalQuestions}
                        </TableCell>
                        <TableCell align="center">
                            {answeredQuestions}
                        </TableCell>
                        <TableCell align="center">
                            {notAnsweredQuestions}
                        </TableCell>
                        <TableCell align="center">
                            {markedAsReviewQuestions}
                        </TableCell>
                        <TableCell align="center">{skippedQuestions}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function getTableRowDetails(questionsList: QuestionOfCurrentOngoingQuiz) {
    let totalQuestions = questionsList.length;
    let answeredQuestions = 0,
        notAnsweredQuestions = 0,
        skippedQuestions = 0,
        markedAsReviewQuestions = 0;
    questionsList.forEach((question) => {
        if (question.isAnswered) answeredQuestions++;
        if (question.isAnswered) markedAsReviewQuestions++;
        else if (question.isVisited && !question.isAnswered)
            notAnsweredQuestions++;
        else if (!question.isVisited) skippedQuestions++;
    });
    return [
        totalQuestions,
        answeredQuestions,
        markedAsReviewQuestions,
        notAnsweredQuestions,
        skippedQuestions,
    ];
}
