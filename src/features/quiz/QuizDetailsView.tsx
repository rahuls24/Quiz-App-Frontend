import { useIsOverflowX } from '@CustomHook/useIsOverflow';
import { selectUserDetails } from '@Feature/auth/authSlice';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import { compose } from 'ramda';
import { useMemo, useRef } from 'react';
import QuestionsViewForDetailedView from './QuestionsView';
import { selectQuizData, setIsQuizDetailsViewOpen } from './QuizSlice';
type QuizDetailsViewProps = {
    roleOfUser: 'examiner' | 'examinee';
};
function QuizDetailsView(props: QuizDetailsViewProps) {
    const { roleOfUser } = props;
    const topicViewRef = useRef();
    const isTopicViewOverflow = useIsOverflowX(topicViewRef);
    const dispatch = useAppDispatch();
    const quizData = useAppSelector(selectQuizData);
    const { _id: currentUserId = '' } = useAppSelector(selectUserDetails) ?? {};
    const { name: quizName, topics: quizTopics } = quizData.quiz;
    const questions = quizData.questions;
    const isCreatedByUser = useMemo(() => {
        return isCreatedByCurrentUser(quizData?.quiz?.createdBy, currentUserId);
    }, [quizData?.quiz?.createdBy, currentUserId]);
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '85vh',
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div"
                    textAlign={'center'}
                    paddingTop={1}
                >
                    {quizName}
                </Typography>
                <Divider variant="middle" />
                <Box
                    sx={{
                        maxWidth: '100%',
                        backgroundColor: '#f7f7f7',
                        minHeight: '55px',
                        maxHeight: '40px',
                        display: 'flex',
                        justifyContent: isTopicViewOverflow
                            ? 'start'
                            : 'center',
                        alignItems: 'center',
                        overflowX: 'auto',
                        columnGap: '10px',
                        paddingX: 2,
                    }}
                    className="scroll"
                    ref={topicViewRef}
                >
                    {quizTopics.map((topic) => {
                        return (
                            <Chip
                                label={`${topic}`}
                                key={`orderDetails${topic}`}
                            />
                        );
                    })}
                </Box>
            </Box>

            <Box
                sx={{
                    maxHeight: '55vh',
                    overflowY: 'auto',
                }}
                className="scroll"
            >
                {roleOfUser === 'examiner' && (
                    <QuestionsViewForDetailedView
                        isCreatedByUser={isCreatedByUser}
                        questions={questions}
                    />
                )}
            </Box>
            <Box
                sx={{
                    width: '100%',
                    minHeight: '40px',
                    backgroundColor: '#f7f7f7',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ margin: 1 }}>
                    <Tooltip title="Close">
                        <IconButton
                            aria-label="close"
                            size="large"
                            onClick={() =>
                                compose(
                                    dispatch,
                                    setIsQuizDetailsViewOpen
                                )(false)
                            }
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
                {roleOfUser === 'examiner' && isCreatedByUser && (
                    <Box sx={{ margin: 1 }}>
                        <Tooltip title="Edit Quiz">
                            {/* This feature is not part of current MVP */}
                            <IconButton aria-label="edit" size="large" disabled>
                                <EditIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                {roleOfUser === 'examinee' && (
                    <Box sx={{ margin: 1 }}>
                        <Tooltip title="Start Quiz">
                            <IconButton aria-label="edit" size="large">
                                <PlayCircleOutlineOutlinedIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default QuizDetailsView;

// Util Functions
function isCreatedByCurrentUser(createdBy: string, userId: string) {
    return createdBy === userId;
}
