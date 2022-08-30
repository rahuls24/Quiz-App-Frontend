import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { calculateAccuracy } from '@SharedFunction/quizRelated';
type UserQuizHistorySummeryProps = {
    totalQuizzes: number;
    totalCorrectAnswers: number;
    totalWrongAnswer: number;
    totalSkippedQuestions: number;
};
function UserQuizHistorySummery(props: UserQuizHistorySummeryProps) {
    const {
        totalQuizzes,
        totalCorrectAnswers,
        totalWrongAnswer,
        totalSkippedQuestions,
    } = props;
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h6" gutterBottom>
                    Quizzes Summary
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack
                    spacing={{ xs: 1, md: 6 }}
                    direction={{ xs: 'column', md: 'row' }}
                    divider={<Divider orientation="horizontal" flexItem />}
                >
                    <Box>
                        <Typography
                            align="center"
                            variant="button"
                            display="block"
                            gutterBottom
                        >
                            Total Quiz Given
                        </Typography>
                        <Typography align="center">{totalQuizzes}</Typography>
                    </Box>
                    <Box>
                        <Typography
                            align="center"
                            variant="button"
                            display="block"
                            gutterBottom
                        >
                            Correct Answers
                        </Typography>
                        <Typography align="center">
                            {totalCorrectAnswers}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            align="center"
                            variant="button"
                            display="block"
                            gutterBottom
                        >
                            Wrong Answers
                        </Typography>
                        <Typography align="center">
                            {totalWrongAnswer}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            align="center"
                            variant="button"
                            display="block"
                            gutterBottom
                        >
                            Skipped Questions
                        </Typography>
                        <Typography align="center">
                            {totalSkippedQuestions}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            align="center"
                            variant="button"
                            display="block"
                            gutterBottom
                        >
                            Accuracy
                        </Typography>
                        <Typography align="center">{`${calculateAccuracy(
                            totalCorrectAnswers,
                            totalWrongAnswer
                        )}%`}</Typography>
                    </Box>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

export default UserQuizHistorySummery;

// Util Functions
