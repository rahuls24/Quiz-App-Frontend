import accuracyIcon from '@Asset/accuracy.svg';
import attemptedIcon from '@Asset/attempted.svg';
import scoreIcon from '@Asset/score.svg';
import speedIcon from '@Asset/speed.svg';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
type QuizMarksSummeryProps = {
    numberOfRightAnswers: number;
    numberOfWrongAnswers: number;
    numberSkippedQuestions: number;
    totalTimeTaken: number;
    marks: number;
};
function QuizMarksSummery(props: QuizMarksSummeryProps) {
    const {
        numberOfRightAnswers,
        numberOfWrongAnswers,
        numberSkippedQuestions,
        totalTimeTaken,
        marks,
    } = props;
    const summaryData = useMemo(() => {
        const totalAttemptQuestions =
            numberOfRightAnswers + numberOfWrongAnswers;
        const speed = Math.ceil(totalAttemptQuestions / totalTimeTaken);

        const accuracy = Math.ceil(
            (numberOfRightAnswers * 100) / totalAttemptQuestions
        );
        return [
            {
                icon: scoreIcon,
                headerText: 'Score',
                value: `${marks}/${
                    totalAttemptQuestions + numberSkippedQuestions
                }`,
            },
            {
                icon: attemptedIcon,
                headerText: 'Attempted',
                value: `${totalAttemptQuestions}`,
            },
            {
                icon: speedIcon,
                headerText: 'Speed',
                value: `${speed}Q/${'min'}`,
            },
            {
                icon: accuracyIcon,
                headerText: 'Accuracy',
                value: isNaN(accuracy) ? '0%' : `${accuracy}%`,
            },
        ];
    }, [
        numberOfRightAnswers,
        numberOfWrongAnswers,
        numberSkippedQuestions,
        totalTimeTaken,
        marks,
    ]);
    return (
        <>
            <Grid container spacing={2}>
                {summaryData.map((item) => {
                    return (
                        <Grid item xs={6} key={item.headerText}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: 2,
                                }}
                            >
                                <Avatar alt="Score Icon" src={item.icon} />
                                <Box sx={{ paddingLeft: 2 }}>
                                    <Typography
                                        variant="overline"
                                        display="block"
                                    >
                                        {item.headerText}
                                    </Typography>
                                    <Typography
                                        variant="button"
                                        display="block"
                                    >
                                        {item.value}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
}

export default QuizMarksSummery;
