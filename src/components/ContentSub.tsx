import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Popover, TextField, Snackbar, Alert } from '@mui/material';
import { fetchDataByButtonType, postData } from '../apiService';

interface TaskVO {
    taskName: string;
    taskDesc: string;
    taskId: string;
    assignee: string;
    comment: string;
    eventName: string;
}

interface ContentSubProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentSub: React.FC<ContentSubProps> = ({ btn_type, user_name }) => {
    const [tasks, setTasks] = useState<TaskVO[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchTasks = async () => {
            if (btn_type && user_name) {
                const data = await fetchDataByButtonType(btn_type, user_name);
                setTasks(data.taskList || []);
            }
        };

        fetchTasks();
    }, [btn_type, user_name]);

    const handleCommentOpen = (event: React.MouseEvent<HTMLButtonElement>, taskId: string) => {
        setAnchorEl(event.currentTarget);
        setCurrentTaskId(taskId);
    };

    const handleCommentClose = async () => {
        setAnchorEl(null);
        setNewComment('');
        setCurrentTaskId(null);
        const data = await fetchDataByButtonType(btn_type, user_name);
        setTasks(data.taskList || []);
    };

    const handleCommentSubmit = async () => {
        if (currentTaskId) {
            const response = await postData('commentTask', {
                username: user_name,
                taskId: currentTaskId,
                comment: newComment,
            });

            if (response.commentSuccess) {
                setSnackbarMessage('Comment submitted successfully!');
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage('Failed to submit comment.');
                setSnackbarSeverity('error');
            }

            setSnackbarOpen(true);
            handleCommentClose();
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
            <Typography variant="h4">My Tasks</Typography>
            {tasks.length === 0 ? (
                <Typography>No tasks assigned yet</Typography>
            ) : (
                tasks.map((task) => (
                    <Card key={task.taskId} style={{ margin: '10px 0' }}>
                        <CardContent>
                            <Typography variant="h5">{task.taskName}</Typography>
                            <Typography color="textSecondary">Event: {task.eventName}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Description: {task.taskDesc}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Comment: {task.comment}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => handleCommentOpen(e, task.taskId)}
                                style={{ marginTop: '10px' }}
                            >
                                Comment
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCommentClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ padding: '20px' }}>
                    <Typography variant="h6">Add Comment</Typography>
                    <TextField
                        label="Comment"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
                        Submit
                    </Button>
                </div>
            </Popover>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
                open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ContentSub;