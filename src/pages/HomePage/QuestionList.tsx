import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { RootState } from '../../store';

const useStyles = makeStyles()(() => {
  return {
    root: {
      width: 'auto',
      backgroundColor: '#f5f5f5',
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
}

function QuestionList() {
  const { classes } = useStyles();
  const [questions, setQuestions] = useState<Question[]>([]);
  const { isAuth } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get('/api/questions');
      if (response.status === 200) {
        setQuestions(response.data);
      } else {
        // Handle the error
        console.log(response.data);
      }
    };

    fetchQuestions();
  }, []);

  const handleUpvote = async (question: Question) => {
    if (!isAuth) {
      alert('You must be logged in to vote.');
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
      console.log(response.data);
    }
  };

  const handleDownvote = async (question: Question) => {
    if (!isAuth) {
      alert('You must be logged in to vote.');
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
      // Handle the error
      console.log(response.data);
    }
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
            <ListItemText primary={question.title} secondary={question.body} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default QuestionList;
