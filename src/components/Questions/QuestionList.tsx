import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { RootState } from '../../store';
import Tag from '../Tags/Tag';

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      width: 'auto',
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      maxHeight: 'auto',
      margin: '0 auto',
    },
    voteButtons: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: '16px',
      minWidth: '72px',
    },
  };
});

interface Question {
  id: number;
  title: string;
  body: string;
  upvotes: number;
  downvotes: number;
  tags: string[];
  expertsOnly: boolean;
  searchTerm: string;
}

function QuestionList() {
  const { classes } = useStyles();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { isAuth } = useSelector((state: RootState) => state.app);
  const [expertsOnly] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get('/api/questions', {
        params: {
          expertsOnly: expertsOnly ? 'true' : undefined,
        },
      });
      if (response.status === 200) {
        setQuestions(response.data);
      } else {
        // Handle the error
        setAlertMessage(response.data);
        setShowAlert(true);
      }
    };

    fetchQuestions();
  }, [expertsOnly]);

  const handleUpvote = async (question: Question) => {
    if (!isAuth) {
      setAlertMessage('You must be logged in to vote.');
      setShowAlert(true);
      return;
    }
    // Update the upvote count for the question
    const updatedQuestion = {
      ...question,
      upvotes: question.upvotes + 1,
    };
    const response = await axios.put(`/api/questions/${question.id}/upvote`);
    if (response.status === 200) {
      // Update the questions state with the updated question
      const updatedQuestions = questions.map((q) => {
        if (q.id === question.id) {
          return updatedQuestion;
        }
        return q;
      });
      setQuestions(updatedQuestions);
    } else {
      // Handle the error
      setAlertMessage(response.data);
      setShowAlert(true);
    }
  };

  const handleDownvote = async (question: Question) => {
    if (!isAuth) {
      setAlertMessage('You must be logged in to vote.');
      setShowAlert(true);
      return;
    }
    // Update the downvote count for the question
    const updatedQuestion = {
      ...question,
      downvotes: question.downvotes + 1,
    };
    const response = await axios.put(`/api/questions/${question.id}/downvote`);
    if (response.status === 200) {
      // Update the questions state with the updated question
      const updatedQuestions = questions.map((q) => {
        if (q.id === question.id) {
          return updatedQuestion;
        }
        return q;
      });
      setQuestions(updatedQuestions);
    } else {
      setAlertMessage(response.data);
      setShowAlert(true);
    }
  };

  const handleTagClick = (tag: string) => {
    // Navigate to the tag page
    // eslint-disable-next-line no-console
    console.log(`Navigating to tag: ${tag}`);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <List className={classes.root}>
        {questions.map((question) => (
          <ListItem key={question.id} button>
            <div className={classes.voteButtons}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleUpvote(question)}
              >
                Upvote ({question.upvotes})
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDownvote(question)}
              >
                Downvote ({question.downvotes})
              </Button>
            </div>
            <ListItemText
              primary={question.title}
              secondary={question.body}
              secondaryTypographyProps={{ component: 'div' }}
            />
            <div>
              {question.tags.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  handleClick={async () => handleTagClick(tag)}
                />
              ))}
            </div>
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default QuestionList;
