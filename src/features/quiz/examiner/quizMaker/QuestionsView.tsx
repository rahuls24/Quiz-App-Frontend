import CloseOutlined from '@mui/icons-material/CloseOutlined';
import PlusOneOutlined from '@mui/icons-material/PlusOneOutlined';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Question } from '@Type/Quiz';
import React from 'react';

type QuestionsViewProps = {
    questionIndex: number;
    question: Question;
    updateQuestionsList: (questionsList: {
        updatedQuestion: Question;
        index: number;
    }) => void;
};

export default function QuestionsView(props: QuestionsViewProps) {
    const { questionIndex, question, updateQuestionsList } = props;
    const questionOptionsInputHandler = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const currentOptionValue = e.target.value;
        if (index === question.options.length - 1) {
            const currentQuestion: Question = JSON.parse(
                JSON.stringify(question)
            );

            if (currentQuestion.options[index] === '') {
                currentQuestion.options.push('');
            }

            currentQuestion.options[index] = currentOptionValue;
            updateQuestionsList({
                updatedQuestion: currentQuestion,
                index: questionIndex,
            });
        } else {
            const currentQuestion: Question = JSON.parse(
                JSON.stringify(question)
            );
            currentQuestion.options[index] = currentOptionValue;
            updateQuestionsList({
                updatedQuestion: currentQuestion,
                index: questionIndex,
            });
        }
    };
    const correctAnswerCheckboxHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        let currentQuestion: Question = JSON.parse(JSON.stringify(question));
        if (e.target.checked) {
            currentQuestion.answers.push(index);
        } else {
            currentQuestion.answers = currentQuestion.answers.filter(
                (answer) => answer !== index
            );
        }
        updateQuestionsList({
            updatedQuestion: currentQuestion,
            index: questionIndex,
        });
    };
    const deletedAOption = (index: number) => {
        let currentQuestion: Question = JSON.parse(JSON.stringify(question));
        currentQuestion.options = currentQuestion.options.filter(
            (_, i) => i !== index
        );
        currentQuestion.answers = currentQuestion.answers.filter(
            (answer) => answer !== index
        );
        currentQuestion.answers = currentQuestion.answers.map((answer) => {
            if (index > answer) {
                return answer;
            } else {
                return answer - 1;
            }
        });
        updateQuestionsList({
            updatedQuestion: currentQuestion,
            index: questionIndex,
        });
    };
    return (
        <>
            <Grid container columns={{ xs: 4, md: 12 }} columnSpacing={6}>
                <Grid item xs={4} md={12}>
                    <TextField
                        margin="normal"
                        fullWidth
                        autoFocus
                        id={`titleOfQuestionNo${questionIndex}`}
                        label={`Question Title`}
                        name={`titleOfQuestionNo${questionIndex}`}
                        placeholder="Enter your question"
                        value={question.title}
                        onChange={(e) => {
                            const currentQuestion: Question = JSON.parse(
                                JSON.stringify(question)
                            );
                            currentQuestion.title = e.target.value;
                            updateQuestionsList({
                                updatedQuestion: currentQuestion,
                                index: questionIndex,
                            });
                        }}
                    />
                </Grid>
                {question.options.map((option, index) => {
                    return (
                        <Grid
                            item
                            xs={4}
                            md={6}
                            key={`optionOf${question.title}${index}`}
                        >
                            <Grid
                                container
                                columns={{ xs: 8, md: 12 }}
                                sx={{ alignItems: 'center' }}
                            >
                                <Grid item xs={7} md={11}>
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id={`optionNo${index}`}
                                        label={`Option ${index + 1}`}
                                        name={`optionNo${index}`}
                                        placeholder={`Enter option number${
                                            index + 1
                                        }`}
                                        value={option}
                                        onChange={(e) =>
                                            questionOptionsInputHandler(
                                                e,
                                                index
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item xs={1} md={1} justifyContent="end">
                                    {option.length > 0 ? (
                                        <Tooltip title="Mark Correct Answer">
                                            <Checkbox
                                                color="success"
                                                checked={question.answers.includes(
                                                    index
                                                )}
                                                onChange={(e) =>
                                                    correctAnswerCheckboxHandler(
                                                        e,
                                                        index
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Deleted this option">
                                            <IconButton
                                                aria-label="deleted a option"
                                                edge="end"
                                                onClick={() =>
                                                    deletedAOption(index)
                                                }
                                            >
                                                <CloseOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })}
                <Grid
                    item
                    xs={4}
                    md={12}
                    sx={{ marginTop: 1, justifyContent: 'center' }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Tooltip title="Add an option">
                            <IconButton
                                aria-label="Add an option"
                                edge="end"
                                onClick={() => {
                                    let currentQuestion: Question = JSON.parse(
                                        JSON.stringify(question)
                                    );
                                    currentQuestion.options.push('');
                                    updateQuestionsList({
                                        updatedQuestion: currentQuestion,
                                        index: questionIndex,
                                    });
                                }}
                            >
                                <PlusOneOutlined />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
