import { setCurrentOngoingQuestionIndex } from '@Feature/quiz/QuizSlice';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import {
    deepPurple,
    green,
    indigo,
    purple,
    red,
    teal,
} from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useAppDispatch } from '@ReduxStore/hooks';
import { QuestionOfCurrentOngoingQuiz } from '@Type/Quiz';
import * as R from 'ramda';
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

type QuestionQuickSelectProps = {
    open: boolean;
    handleDrawerClose: any;
    questionsList: QuestionOfCurrentOngoingQuiz | undefined;
    setOpenSubmitQuizPopup: () => void;
};
export default function QuestionQuickSelect(props: QuestionQuickSelectProps) {
    const { open, handleDrawerClose, questionsList, setOpenSubmitQuizPopup } =
        props;
    const dispatch = useAppDispatch();
    return (
        <>
            <Drawer
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '15px',
                        marginTop: 2,
                    }}
                >
                    {questionsList !== undefined &&
                        questionsList.map((question: any, index: any) => {
                            if (question.isAnswered)
                                return (
                                    <OptionBtn
                                        btnType="answered"
                                        questionNumber={index + 1}
                                        clickHandler={() =>
                                            R.compose(
                                                dispatch,
                                                setCurrentOngoingQuestionIndex
                                            )(index)
                                        }
                                    />
                                );
                            if (question.isMarkedAsReview)
                                return (
                                    <OptionBtn
                                        btnType="markedForReview"
                                        questionNumber={index + 1}
                                        clickHandler={() =>
                                            R.compose(
                                                dispatch,
                                                setCurrentOngoingQuestionIndex
                                            )(index)
                                        }
                                    />
                                );
                            if (!question.isVisited)
                                return (
                                    <OptionBtn
                                        btnType="notVisited"
                                        questionNumber={index + 1}
                                        clickHandler={() =>
                                            R.compose(
                                                dispatch,
                                                setCurrentOngoingQuestionIndex
                                            )(index)
                                        }
                                    />
                                );
                            if (question.isVisited)
                                return (
                                    <OptionBtn
                                        btnType="notAnswered"
                                        questionNumber={index + 1}
                                        clickHandler={() =>
                                            R.compose(
                                                dispatch,
                                                setCurrentOngoingQuestionIndex
                                            )(index)
                                        }
                                    />
                                );
                            return (
                                <OptionBtn
                                    btnType="notAnswered"
                                    questionNumber={index + 1}
                                    clickHandler={() =>
                                        R.compose(
                                            dispatch,
                                            setCurrentOngoingQuestionIndex
                                        )(index)
                                    }
                                />
                            );
                        })}
                </Box>
                <Box
                    sx={{
                        width: 240,
                        minHeight: '60px',
                        backgroundColor: '#f7f7f7',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'fixed',
                        margin: 0,
                        bottom: 0,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={setOpenSubmitQuizPopup}
                    >
                        Submit
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}

type OptionBtnProps = {
    btnType: 'answered' | 'markedForReview' | 'notVisited' | 'notAnswered';
    questionNumber: number | string;
    clickHandler: any;
};
function OptionBtn(props: OptionBtnProps) {
    // answered, markedForReview, notVisited,notAnswered
    const { btnType, questionNumber, clickHandler } = props;
    const btnColorAndBadgeIcon = {
        answered: {
            color: green[500],
            backgroundColor: green[500],
            hoverBackgroundColor: green[700],
            badgeColor: teal['A400'],
        },
        markedForReview: {
            color: deepPurple[500],
            hoverBackgroundColor: deepPurple[700],
            badgeColor: deepPurple['A200'],
        },
        notVisited: {
            color: deepPurple[50],
            hoverBackgroundColor: deepPurple[100],
            badgeColor: indigo[700],
        },
        notAnswered: {
            color: red[500],
            hoverBackgroundColor: red[700],
            badgeColor: purple['A400'],
        },
    };
    const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
        color: theme.palette.getContrastText(
            btnColorAndBadgeIcon[btnType].color
        ),
        backgroundColor: btnColorAndBadgeIcon[btnType].color,
        '&:hover': {
            backgroundColor: btnColorAndBadgeIcon[btnType].color,
        },
    }));
    return (
        <>
            <ColorButton onClick={clickHandler}>{questionNumber}</ColorButton>
        </>
    );
}
