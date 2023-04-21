/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

type Course = {
  id: number;
  name: string;
};

function NewCourseForm() {
  const [courseName, setCourseName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Course[]>('/api/v1/courses').then((response) => {
      setCourses(response.data);
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentUser = localStorage.getItem('user');

    if (!currentUser) {
      handleSnackbarOpen('Please log in to add a course');
      return;
    }

    try {
      const response = await axios.post('api/v1/course', {
        name: courseName,
      });

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCourseName('');
          // navigate('/courselist'); // redirect to course list instead of post
        }, 3000);
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  const handleSnackbarOpen = (message: string) => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 10,
          marginTop: '32px',
          padding: '16px',
        }}
      >
        <h2>Add a New Course</h2>
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: '100%', marginBottom: '16px' }}>
            <TextField
              label="Course Name"
              variant="outlined"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
        <Box sx={{ width: '100%', marginBottom: '16px', marginTop: '16px' }}>
          <h3>Existing Courses</h3>
          {courses.length === 0 ? (
            <p>No courses found</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course.id}>{course.name}</li>
              ))}
            </ul>
          )}
        </Box>
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
        >
          <MuiAlert onClose={() => setShowSuccess(false)} severity="success">
            Course created successfully!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={() => setShowError(false)}
        >
          <MuiAlert onClose={() => setShowError(false)} severity="error">
            Error creating a new course. Please try again.
          </MuiAlert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default NewCourseForm;
