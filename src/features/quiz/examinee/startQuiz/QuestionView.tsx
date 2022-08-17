import QuestionsList from '@Feature/quiz/QuestionsList';
import {
    selectCurrentOngoingQuestionIndex,
    selectCurrentOnGoingQuizQuestions,
    setCurrentOngoingQuestionIndex,
    setCurrentOnGoingQuizQuestions,
} from '@Feature/quiz/QuizSlice';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import AutoHideAlert from '@SharedComponent/AutoHideAlert';
import * as R from 'ramda';
import * as React from 'react';
import BackToQuestionOnePopup from './BackToQuestionOnePopup';
import BottomNavigationForQuestionView from './BottomNavigationForQuestionView';
import QuestionQuickSelect from './QuestionQuickSelect';
import SubmitQuizPopup from './SubmitQuizPopup';
type QuestionViewProps = {
    isQuickSelectViewOpen: boolean;
    setIsQuickSelectViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
    quizSubmitHandler: () => Promise<boolean>;
};
export default function QuestionView(props: QuestionViewProps) {
    const dispatch = useAppDispatch();
    const [answers, setAnswers] = React.useState<Array<string>>([]);
    const [isBackToQuestionOnePopupOpen, setIsBackToQuestionOnePopupOpen] =
        React.useState(false);
    const [isQuestionQuickSelectOpen, setIsQuestionQuickSelectOpen] =
        React.useState(false);
    const [autoHideAlertMsg, setAutoHideAlertMsg] = React.useState({
        isOpen: false,
        alertMsg: '',
        severity: 'error' as 'error' | 'warning' | 'success',
        autoHideDuration: 4000,
    });
    const {
        isQuickSelectViewOpen,
        setIsQuickSelectViewOpen,
        quizSubmitHandler,
    } = props;
    const currentOnGoingQuizQuestions = useAppSelector(
        selectCurrentOnGoingQuizQuestions
    );
    const currentOngoingQuestionIndex = useAppSelector(
        selectCurrentOngoingQuestionIndex
    );
    const isCurrentQuestionLast = () => {
        return (
            currentOngoingQuestionIndex ===
            currentOnGoingQuizQuestions.length - 1
        );
    };
    const updateAnswer = (
        action: string,
        value?: string,
        shouldUpdateQuestionIndex?: boolean
    ) => {
        let tmpCurrentOnGoingQuizQuestions = JSON.parse(
            JSON.stringify(currentOnGoingQuizQuestions)
        );
        let questionStateObj = {} as questionState;
        switch (action) {
            case 'saveAndNext':
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex][
                    'answers'
                ] = answers;
                questionStateObj = getModifyQuestionState('answered');
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex] = {
                    ...tmpCurrentOnGoingQuizQuestions[
                        currentOngoingQuestionIndex
                    ],
                    ...questionStateObj,
                };
                if (answers.length === 0) {
                    setAutoHideAlertMsg({
                        ...autoHideAlertMsg,
                        isOpen: true,
                        alertMsg: 'Please select any answer before saving',
                    });
                    return;
                }
                R.compose(
                    dispatch,
                    setCurrentOnGoingQuizQuestions
                )(tmpCurrentOnGoingQuizQuestions);
                if (shouldUpdateQuestionIndex === false) return;
                if (isCurrentQuestionLast())
                    setIsBackToQuestionOnePopupOpen(true);
                else
                    R.compose(
                        dispatch,
                        setCurrentOngoingQuestionIndex
                    )(currentOngoingQuestionIndex + 1);

                break;
            case 'next':
                if (
                    isQuestionAnswered(
                        tmpCurrentOnGoingQuizQuestions[
                            currentOngoingQuestionIndex
                        ]
                    )
                )
                    return;
                questionStateObj = getModifyQuestionState('next');
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex] = {
                    ...tmpCurrentOnGoingQuizQuestions[
                        currentOngoingQuestionIndex
                    ],
                    ...questionStateObj,
                };
                R.compose(
                    dispatch,
                    setCurrentOnGoingQuizQuestions
                )(tmpCurrentOnGoingQuizQuestions);
                if (shouldUpdateQuestionIndex === false) return;
                if (isCurrentQuestionLast())
                    setIsBackToQuestionOnePopupOpen(true);
                else
                    R.compose(
                        dispatch,
                        setCurrentOngoingQuestionIndex
                    )(currentOngoingQuestionIndex + 1);

                break;
            case 'markAsReview':
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex][
                    'answers'
                ] = answers;
                questionStateObj = getModifyQuestionState('markedAsReview');
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex] = {
                    ...tmpCurrentOnGoingQuizQuestions[
                        currentOngoingQuestionIndex
                    ],
                    ...questionStateObj,
                };
                if (answers.length === 0) {
                    setAutoHideAlertMsg({
                        ...autoHideAlertMsg,
                        isOpen: true,
                        alertMsg: 'Please select any answer before saving',
                    });
                    return;
                }
                R.compose(
                    dispatch,
                    setCurrentOnGoingQuizQuestions
                )(tmpCurrentOnGoingQuizQuestions);
                if (shouldUpdateQuestionIndex === false) return;
                if (isCurrentQuestionLast())
                    setIsBackToQuestionOnePopupOpen(true);
                else
                    R.compose(
                        dispatch,
                        setCurrentOngoingQuestionIndex
                    )(currentOngoingQuestionIndex + 1);

                break;
            case 'clearResponse':
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex][
                    'answers'
                ] = [];
                questionStateObj = getModifyQuestionState('clearResponse');
                tmpCurrentOnGoingQuizQuestions[currentOngoingQuestionIndex] = {
                    ...tmpCurrentOnGoingQuizQuestions[
                        currentOngoingQuestionIndex
                    ],
                    ...questionStateObj,
                };
                setAnswers([]);
                R.compose(
                    dispatch,
                    setCurrentOnGoingQuizQuestions
                )(tmpCurrentOnGoingQuizQuestions);
                break;
            default:
                break;
        }
    };

    const optionOnchangeHandler = (
        value: string,
        shouldAdd: boolean,
        questionType: 'singleAnswer' | 'multipleAnswer'
    ) => {
        if (questionType === 'singleAnswer') {
            setAnswers([value]);
        } else if (questionType === 'multipleAnswer') {
            if (shouldAdd) {
                if (!answers.includes(value))
                    setAnswers((prev) => [...prev, value]);
            } else
                setAnswers((prev) => prev.filter((answer) => answer !== value));
        }
    };
    const currentActiveQuestion =
        currentOnGoingQuizQuestions[currentOngoingQuestionIndex];
    React.useEffect(() => {
        const { answers = [] } = currentOnGoingQuizQuestions[
            currentOngoingQuestionIndex
        ] ?? { answers: [] };
        setAnswers(answers);
    }, [currentOnGoingQuizQuestions, currentOngoingQuestionIndex, setAnswers]);
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        paddingLeft: 2,
                    }}
                >
                    <ChevronLeftIcon
                        fontSize="large"
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                            setIsQuickSelectViewOpen(!isQuickSelectViewOpen)
                        }
                    />
                </Box>
                <Box>
                    <Typography variant="h5" component="div">{`Question No. ${
                        currentOngoingQuestionIndex + 1
                    }`}</Typography>
                    <Divider variant="fullWidth" />
                </Box>
                <Box>
                    {currentActiveQuestion !== undefined && (
                        <>
                            <Box
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                >{`Direction:`}</Typography>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ fontWeight: 400 }}
                                >
                                    {currentActiveQuestion.title}
                                </Typography>
                            </Box>
                            <QuestionsList
                                options={currentActiveQuestion.options}
                                answers={answers}
                                isCreatedByUser={false}
                                onChangeHandler={optionOnchangeHandler}
                                questionType={
                                    currentActiveQuestion.questionType
                                }
                            />
                        </>
                    )}
                </Box>
            </Box>
            <BottomNavigationForQuestionView
                updateAnswer={updateAnswer}
                isQuickSelectViewOpen={isQuickSelectViewOpen}
            />
            <QuestionQuickSelect
                open={isQuickSelectViewOpen}
                handleDrawerClose={() => setIsQuickSelectViewOpen(false)}
                questionsList={currentOnGoingQuizQuestions}
                setOpenSubmitQuizPopup={() =>
                    setIsQuestionQuickSelectOpen(true)
                }
                updateAnswer={updateAnswer}
            />
            <AutoHideAlert
                onCloseHandler={() =>
                    setAutoHideAlertMsg({ ...autoHideAlertMsg, isOpen: false })
                }
                {...autoHideAlertMsg}
            />
            <BackToQuestionOnePopup
                open={isBackToQuestionOnePopupOpen}
                setOpen={setIsBackToQuestionOnePopupOpen}
            />
            <SubmitQuizPopup
                open={isQuestionQuickSelectOpen}
                setOpen={setIsQuestionQuickSelectOpen}
                quizSubmitHandler={quizSubmitHandler}
            />
        </>
    );
}

type questionStateAction =
    | 'next'
    | 'markedAsReview'
    | 'answered'
    | 'clearResponse';
type questionState = {
    isVisited: boolean;
    isMarkedAsReview: boolean;
    isAnswered: boolean;
};
function getModifyQuestionState(state: questionStateAction) {
    switch (state) {
        case 'answered':
            return {
                isVisited: true,
                isMarkedAsReview: false,
                isAnswered: true,
            };
        case 'markedAsReview':
            return {
                isVisited: true,
                isMarkedAsReview: true,
                isAnswered: false,
            };
        case 'next':
            return {
                isVisited: true,
                isMarkedAsReview: false,
                isAnswered: false,
            };
        case 'clearResponse':
            return {
                isVisited: true,
                isMarkedAsReview: false,
                isAnswered: false,
            };
        default:
            return {
                isVisited: false,
                isMarkedAsReview: false,
                isAnswered: false,
            };
    }
}

function isQuestionAnswered(questionDetails: any) {
    return questionDetails?.isAnswered ?? false;
}
