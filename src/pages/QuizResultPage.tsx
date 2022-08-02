import React from 'react';
import Header from '../shared/components/Header';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QuizMarksSummery from '../features/quiz/quizResult/QuizMarksSummery';
import ScorePieChart from '../features/quiz/quizResult/ScorePieChart';
import { useAppSelector } from '../app/hooks';
import { selectQuizResultDetails } from '../features/quiz/QuizSlice';
function QuizResultPage() {
    const quizResultDetails = useAppSelector(selectQuizResultDetails);
    const quizMarksSummeryProps = React.useMemo(() => {
        return {
            numberOfRightAnswers: quizResultDetails.numberOfRightAnswers,
            numberOfWrongAnswers: quizResultDetails.numberOfWrongAnswers,
            skippedQuestions: quizResultDetails.skippedQuestions,
            totalTimeTaken: quizResultDetails.totalTimeTaken,
            marks: quizResultDetails.marks,
        };
    }, [quizResultDetails]);
    const scorePieChartProps = React.useMemo(() => {
        return {
            numberOfRightAnswers: quizResultDetails.numberOfRightAnswers,
            numberOfWrongAnswers: quizResultDetails.numberOfWrongAnswers,
            skippedQuestions: quizResultDetails.skippedQuestions,
        };
    }, [quizResultDetails]);
    return (
        <>
            <Header />
            <Container component="main" maxWidth="md" sx={{ marginTop: 4 }}>
                <CssBaseline />
                <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    align="center"
                >
                    {`Thank you for attempting Quiz '${quizResultDetails.quizName} ' !`}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        marginTop: 2,
                        gap: 4,
                    }}
                >
                    <Paper
                        sx={{
                            minWidth: { xs: '100%', md: '400px' },
                            maxWidth: { xs: '100%', md: '400px' },
                        }}
                    >
                        <QuizMarksSummery {...quizMarksSummeryProps} />
                    </Paper>
                    <Paper
                        sx={{
                            minWidth: { xs: '100%', md: '400px' },
                            maxWidth: { xs: '100%', md: '400px' },
                        }}
                    >
                        <ScorePieChart {...scorePieChartProps} />
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default QuizResultPage;
