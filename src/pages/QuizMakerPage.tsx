import useDocumentTitle from '@CustomHook/useDocumentTitle';
import AddQuizInputField from '@Feature/quiz/examiner/quizMaker/AddQuizInputField';
import ConfirmQuizPopup from '@Feature/quiz/examiner/quizMaker/ConfirmQuizPopupProps';
import QuestionsView from '@Feature/quiz/examiner/quizMaker/QuestionsView';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Save from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
    useSaveAQuizMutation,
    useSaveQuestionsForAQuizMutation,
} from '@ReduxStore/apis/apiSlice';
import AutoHideAlert from '@SharedComponent/AutoHideAlert';
import Header from '@SharedComponent/Header';
import { isNonEmptyString } from '@SharedFunction/utility';
import { AutoHideAlertProps, Question } from '@Type/Quiz';
import {
    Dispatch as ReactDispatch,
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

function QuizMakerPage() {
    // Change Document Tile 
    useDocumentTitle('Quiz App | Maker');
    const navigate = useNavigate();
    const [
        saveAQuiz,
        {
            isError: isErrorForSaveAQuiz,
            isSuccess: isSuccessForSaveAQuiz,
            isLoading: isLoadingForSaveAQuiz,
        },
    ] = useSaveAQuizMutation();

    const [
        saveQuestionsOfTheQuiz,
        {
            isError: isErrorForSaveQuestionsOfTheQuiz,
            isSuccess: isSuccessForSaveQuestionsOfTheQuiz,
            isLoading: isLoadingForSaveQuestionsOfTheQuiz,
        },
    ] = useSaveQuestionsForAQuizMutation();

    const [isQuizSaveConfirmationPopupOpen, setQuizSaveConfirmationPopupOpen] =
        useState(false);

    const [autoHideAlertProps, setAutoHideAlertProps] =
        useState<AutoHideAlertProps>({
            isOpen: false,
            alertMsg: '',
            severity: 'error',
            autoHideDuration: 6000,
        });

    const [quizMakerFormState, quizMakerFormDispatch] = useReducer(
        quizMakerReducer,
        getQuizMakerFormInitialState()
    );

    const actionDispatcherForQuizMakerForm = useMemo(() => {
        return actionCreatorForQuizMakerForm(quizMakerFormDispatch);
    }, []);

    const addQuestionHandler = useCallback(() => {
        // It means quiz is already save in db. Now we have add new question
        if (quizMakerFormState.quizId !== '') {
            let newQuestion = {
                title: '',
                options: ['', ''],
                answers: [] as number[],
            };
            let updateQuestionsListPayload = {
                updatedQuestion: newQuestion,
                index: quizMakerFormState.questions.length,
            };
            actionDispatcherForQuizMakerForm.updateQuestionsList(
                updateQuestionsListPayload
            );
            return;
        } else {
            // It means quiz is not save in db. Show popup for saving the quiz first.
            setQuizSaveConfirmationPopupOpen(true);
        }
    }, [
        actionDispatcherForQuizMakerForm,
        quizMakerFormState.questions.length,
        quizMakerFormState.quizId,
    ]);

    const saveQuizHandler = async () => {
        const saveAQuizPayload = {
            name: quizMakerFormState.quizName,
            topics:
                quizMakerFormState.topics === ''
                    ? 'misc'
                    : quizMakerFormState.topics,
            totalTime: quizMakerFormState.totalTime,
        };
        try {
            const quizData = await saveAQuiz(saveAQuizPayload);

            // TODO: Show some alert message for this
            if (quizData && 'error' in quizData) return;

            // TODO: Show some alert message for this
            if (!quizData.data?.quiz?._id) return;

            actionDispatcherForQuizMakerForm.setQuizId(
                quizData.data?.quiz?._id
            );
            const firstQuestion: Question = {
                title: '',
                options: ['', ''],
                answers: [] as number[],
            };
            const updateQuestionsListPayload = {
                updatedQuestion: firstQuestion,
                index: 0,
            };
            actionDispatcherForQuizMakerForm.updateQuestionsList(
                updateQuestionsListPayload
            );
        } catch (error) {
            console.error('Something went wrong in saveQuizHandler');
        }
    };

    const saveQuestionsOfTheQuizHandler = useCallback(async () => {
        const questionsArrayForPayload = quizMakerFormState.questions.map(
            (question) => {
                return {
                    questionText: question.title,
                    questionType:
                        question.answers.length === 1
                            ? 'singleAnswer'
                            : 'multipleAnswer',
                    quizzes: [quizMakerFormState.quizId],
                    options: question.options,
                    answers: question.answers,
                };
            }
        );
        const questionPayload = {
            questionsData: questionsArrayForPayload,
        };
        try {
            const isSaved = await saveQuestionsOfTheQuiz(questionPayload);
            if ('error' in isSaved) {
                // TODO: Show some alert message
                console.error(
                    'Something went wrong in saveQuestionsOfTheQuizHandler'
                );
            }
        } catch (error) {
            console.error(
                'Something went wrong in saveQuestionsOfTheQuizHandler'
            );
        }
    }, [
        quizMakerFormState.questions,
        quizMakerFormState.quizId,
        saveQuestionsOfTheQuiz,
    ]);

    //! useEffect ---
    // For manipulating autoHideAlertProps
    useEffect(() => {
        if (isSuccessForSaveAQuiz) {
            setAutoHideAlertProps({
                isOpen: true,
                alertMsg: 'Quiz name and topics are saved successfully',
                severity: 'success',
                autoHideDuration: 4000,
            });
            return;
        }
        if (isErrorForSaveAQuiz) {
            setAutoHideAlertProps({
                isOpen: true,
                alertMsg: 'Something went wrong. Please try again',
                severity: 'error',
                autoHideDuration: 4000,
            });
            return;
        }
    }, [isErrorForSaveAQuiz, isSuccessForSaveAQuiz]);

    // For Saving the complete quiz
    useEffect(() => {
        if (isSuccessForSaveQuestionsOfTheQuiz) {
            setAutoHideAlertProps({
                isOpen: true,
                alertMsg: 'Quiz is created successfully',
                severity: 'success',
                autoHideDuration: 6000,
            });
            navigate('/');
            return;
        }
        if (isErrorForSaveQuestionsOfTheQuiz) {
            setAutoHideAlertProps({
                isOpen: true,
                alertMsg: 'Something went wrong. Please try again',
                severity: 'error',
                autoHideDuration: 4000,
            });
            return;
        }
    }, [
        isSuccessForSaveQuestionsOfTheQuiz,
        isErrorForSaveQuestionsOfTheQuiz,
        navigate,
    ]);
    //  Already added question view
    const renderAlreadyAddedQuestions = useMemo(() => {
        return quizMakerFormState.questions.map((question, index) => {
            return (
                <Fragment key={`${question.title}${index}`}>
                    <Box sx={{ marginY: 2 }}>
                        <Divider variant="middle">
                            {`Question No ${index + 1}`}
                        </Divider>
                    </Box>
                    <QuestionsView
                        questionIndex={index}
                        question={question}
                        updateQuestionsList={
                            actionDispatcherForQuizMakerForm.updateQuestionsList
                        }
                    />
                </Fragment>
            );
        });
    }, [quizMakerFormState, actionDispatcherForQuizMakerForm]);

    const shouldHideSaveQuizBtn = useMemo(() => {
        return (
            quizMakerFormState.quizName.length < 3 ||
            quizMakerFormState.questions.length <= 0
        );
    }, [
        quizMakerFormState.questions.length,
        quizMakerFormState.quizName.length,
    ]);

    const renderOnlyAddQuestionBtn = useMemo(() => {
        return (
            <Grid container columns={{ xs: 4, md: 12 }}>
                <Grid item xs={4} md={12}>
                    <LoadingButton
                        loading={isLoadingForSaveAQuiz ? true : false}
                        fullWidth
                        loadingPosition="end"
                        endIcon={<AddIcon />}
                        variant="contained"
                        onClick={addQuestionHandler}
                        disabled={
                            quizMakerFormState.quizName.length < 3
                                ? true
                                : false
                        }
                        sx={{ marginTop: 1 }}
                    >
                        {'Add Question'}
                    </LoadingButton>
                </Grid>
            </Grid>
        );
    }, [addQuestionHandler, isLoadingForSaveAQuiz, quizMakerFormState]);
    const renderAddQuestionBtnWithSaveQuizBtn = useMemo(() => {
        return (
            <Grid container columns={{ xs: 4, md: 12 }}>
                <Grid item xs={4} md={8}>
                    <Button
                        variant="contained"
                        fullWidth
                        endIcon={<AddIcon />}
                        onClick={addQuestionHandler}
                        disabled={
                            quizMakerFormState.quizName.length < 3
                                ? true
                                : false
                        }
                        sx={{
                            marginTop: 1,
                        }}
                    >
                        {'Add Question'}
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={0}
                    md={1}
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'block',
                        },
                    }}
                ></Grid>
                <Grid item xs={4} md={3}>
                    <LoadingButton
                        variant="contained"
                        fullWidth
                        loading={
                            isLoadingForSaveQuestionsOfTheQuiz ? true : false
                        }
                        loadingPosition="end"
                        endIcon={<Save />}
                        sx={{ marginTop: 1 }}
                        color="success"
                        disabled={shouldDisableSaveQuiz(
                            quizMakerFormState.questions
                        )}
                        onClick={saveQuestionsOfTheQuizHandler}
                    >
                        Save Quiz
                    </LoadingButton>
                </Grid>
            </Grid>
        );
    }, [
        addQuestionHandler,
        isLoadingForSaveQuestionsOfTheQuiz,
        quizMakerFormState,
        saveQuestionsOfTheQuizHandler,
    ]);
    return (
        <>
            <Header />
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {'Create an awesome quiz in minutes'}
                    </Typography>
                    <Paper
                        elevation={3}
                        sx={{ marginTop: 5, minWidth: '100%', padding: 2 }}
                    >
                        <AddQuizInputField
                            actionDispatcherForQuizMakerForm={
                                actionDispatcherForQuizMakerForm
                            }
                            quizId={quizMakerFormState.quizId}
                        />

                        {/* Already added question view */}
                        {renderAlreadyAddedQuestions}

                        {shouldHideSaveQuizBtn
                            ? renderOnlyAddQuestionBtn
                            : renderAddQuestionBtnWithSaveQuizBtn}
                    </Paper>
                </Box>
            </Container>
            <ConfirmQuizPopup
                open={isQuizSaveConfirmationPopupOpen}
                setOpen={setQuizSaveConfirmationPopupOpen}
                onConfirmHandler={saveQuizHandler}
            />
            <AutoHideAlert
                onCloseHandler={() =>
                    setAutoHideAlertProps({
                        ...autoHideAlertProps,
                        isOpen: false,
                    })
                }
                {...autoHideAlertProps}
            />
        </>
    );
}

export default QuizMakerPage;

// For Reducer Start
type QuizMakerForm = {
    quizName: string;
    quizId: string;
    topics: string;
    questions: Question[];
    totalTime: number;
};
type QuizMakerFormActionWithStringPayload = {
    type:
        | 'SET_QUIZ_NAME'
        | 'SET_TOPICS_OF_THE_QUIZ'
        | 'SET_QUIZ_ID_OF_THE_QUIZ';
    payload: string;
};
type QuizMakerFormActionWithNumberPayload = {
    type: 'SET_QUIZ_TIME';
    payload: number;
};

type QuizMakerFormActionWithQuestionTypePayload = {
    type: 'UPDATE_QUESTION_OF_QUESTIONS_LIST';
    payload: {
        updatedQuestion: Question;
        index: number;
    };
};

type QuizMakerFromActionWithWholeState = {
    type: 'SET_THE_STORE_TO_INITIAL_STATE';
    payload: QuizMakerForm;
};

type QuizMakerFormAction =
    | QuizMakerFormActionWithStringPayload
    | QuizMakerFormActionWithQuestionTypePayload
    | QuizMakerFromActionWithWholeState
    | QuizMakerFormActionWithNumberPayload;

function quizMakerReducer(state: QuizMakerForm, action: QuizMakerFormAction) {
    switch (action.type) {
        case 'SET_QUIZ_NAME':
            return { ...state, quizName: action.payload };
        case 'SET_TOPICS_OF_THE_QUIZ':
            return { ...state, topics: action.payload };
        case 'SET_QUIZ_ID_OF_THE_QUIZ':
            return { ...state, quizId: action.payload };
        case 'UPDATE_QUESTION_OF_QUESTIONS_LIST':
            const currentQuestionsList = state.questions;
            currentQuestionsList[action.payload.index] =
                action.payload.updatedQuestion;
            return { ...state, questions: currentQuestionsList };
        case 'SET_QUIZ_TIME':
            return { ...state, totalTime: action.payload };
        case 'SET_THE_STORE_TO_INITIAL_STATE':
            return { ...action.payload };
        default:
            return state;
    }
}

function actionCreatorForQuizMakerForm(
    dispatch: ReactDispatch<QuizMakerFormAction>
) {
    function setQuizName(quizName: string) {
        return dispatch({ type: 'SET_QUIZ_NAME', payload: quizName });
    }
    function setTopicsForTheQuiz(quizTitle: string) {
        dispatch({ type: 'SET_TOPICS_OF_THE_QUIZ', payload: quizTitle });
    }
    function setQuizId(quizId: string) {
        dispatch({ type: 'SET_QUIZ_ID_OF_THE_QUIZ', payload: quizId });
    }
    function updateQuestionsList(questionsList: {
        updatedQuestion: Question;
        index: number;
    }) {
        dispatch({
            type: 'UPDATE_QUESTION_OF_QUESTIONS_LIST',
            payload: questionsList,
        });
    }

    function setQuizMakerFormStateToInitialState(state: QuizMakerForm) {
        dispatch({
            type: 'SET_THE_STORE_TO_INITIAL_STATE',
            payload: state,
        });
    }
    function setQuizTime(time: number) {
        dispatch({
            type: 'SET_QUIZ_TIME',
            payload: time,
        });
    }
    return {
        setQuizName,
        setTopicsForTheQuiz,
        setQuizId,
        updateQuestionsList,
        setQuizMakerFormStateToInitialState,
        setQuizTime,
    };
}

function getQuizMakerFormInitialState(): QuizMakerForm {
    return {
        quizName: '',
        topics: '',
        quizId: '',
        questions: [] as Question[],
        totalTime: 30,
    };
}
// For Reducer Ended

// Util Functions
function shouldDisableSaveQuiz(questionsList: Question[]) {
    return !questionsList.every(isValidQuestion);
    // Helper functions
    function isValidQuestion(question: Question) {
        return (
            isNonEmptyString(question.title) &&
            isValidOptionAndAnswer(question.options, question.answers)
        );
    }
    function isValidOptionAndAnswer(options: string[], answers: number[]) {
        if (options.length === 0 || answers.length === 0) return false;
        const isValidAnswer = isValidAnswerHelper(options.length);
        return options.every(isNonEmptyString) && answers.every(isValidAnswer);
    }
    function isValidAnswerHelper(optionLength: number) {
        return (answer: number) => {
            return optionLength > answer;
        };
    }
}
