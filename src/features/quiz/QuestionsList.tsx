import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import { v4 as uuidv4 } from 'uuid';
type QuestionsListProps = {
    options: string[];
    isCreatedByUser: boolean;
    questionType: 'singleAnswer' | 'multipleAnswer';
    answers?: string[];
    onChangeHandler?: (
        value: string,
        shouldAdd: boolean,
        questionType: 'singleAnswer' | 'multipleAnswer'
    ) => void;
};
export default function QuestionsList(props: QuestionsListProps) {
    const {
        options,
        answers = [],
        isCreatedByUser,
        onChangeHandler,
        questionType,
    } = props;
    return (
        <List sx={{ width: '100%' }}>
            {options.map((option, index) => {
                const labelId = uuidv4();
                return (
                    <ListItem
                        key={labelId}
                        secondaryAction={
                            // This btn is disabled because edit option is not part of MVP
                            isCreatedByUser ? (
                                <IconButton
                                    edge="end"
                                    aria-label="comments"
                                    disabled
                                >
                                    <EditIcon />
                                </IconButton>
                            ) : null
                        }
                        disablePadding
                        onClick={() => {
                            if (!onChangeHandler) return;
                            if (questionType === 'multipleAnswer') {
                                if (answers.includes(String(index)))
                                    onChangeHandler(
                                        String(index),
                                        false,
                                        'multipleAnswer'
                                    );
                                else
                                    onChangeHandler(
                                        String(index),
                                        true,
                                        'multipleAnswer'
                                    );
                            } else {
                                onChangeHandler(
                                    String(index),
                                    true,
                                    'singleAnswer'
                                );
                            }
                        }}
                    >
                        <ListItemButton role={undefined} dense>
                            <ListItemIcon>
                                {questionType === 'multipleAnswer' ? (
                                    <Checkbox
                                        edge="start"
                                        checked={answers.includes(
                                            String(index)
                                        )}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                        value={option}
                                        color={'success'}
                                    />
                                ) : (
                                    <Radio
                                        checked={answers.includes(
                                            String(index)
                                        )}
                                        value={option}
                                        color={'success'}
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${option}`} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
