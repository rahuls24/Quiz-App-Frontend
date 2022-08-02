import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import accuracyIcon from '../../../assets/accuracy.svg';
import attemptedIcon from '../../../assets/attempted.svg';
import scoreIcon from '../../../assets/score.svg';
import speedIcon from '../../../assets/speed.svg';
import Typography from '@mui/material/Typography';
type QuizMarksSummeryProps = {
    numberOfRightAnswers: number;
    numberOfWrongAnswers: number;
    skippedQuestions: number;
    totalTimeTaken: number;
    marks: number;
};
function QuizMarksSummery(props: QuizMarksSummeryProps) {
    const {
        numberOfRightAnswers,
        numberOfWrongAnswers,
        skippedQuestions,
        totalTimeTaken,
        marks,
    } = props;
    const summaryData = React.useMemo(() => {
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
                value: `${marks}/${totalAttemptQuestions + skippedQuestions}`,
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
                value: `${accuracy}%`,
            },
        ];
    }, [
        numberOfRightAnswers,
        numberOfWrongAnswers,
        skippedQuestions,
        totalTimeTaken,
        marks,
    ]);
    return (
        <>
            <Grid container spacing={2}>
                {summaryData.map((item) => {
                    return (
                        <>
                            <Grid item xs={6}>
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
                        </>
                    );
                })}
            </Grid>
        </>
    );
}

export default QuizMarksSummery;
