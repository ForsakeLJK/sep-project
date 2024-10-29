import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { fetchDataByButtonType, postData } from '../apiService';

interface ApplicationVO {
    applicationId: string;
    eventName: string;
    eventDesc: string;
    eventStatus: string;
    needReview: boolean;
    showSetStatus: boolean;
    nextStatus: string;
    financialComment: string;
}

interface ContentFMProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentFM: React.FC<ContentFMProps> = ({ btn_type, user_name }) => {
    const [applications, setApplications] = useState<ApplicationVO[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentAppId, setCurrentAppId] = useState<string | null>(null);
    const [comment, setComment] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            if (btn_type && user_name) {
                const data = await fetchDataByButtonType(btn_type, user_name);
                setApplications(data.applicationList || []);
            }
        };

        fetchData();
    }, [btn_type, user_name]);

    const handleDialogOpen = (applicationId: string) => {
        setCurrentAppId(applicationId);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentAppId(null);
        setComment('');
    };

    const handleCommentSubmit = async () => {
        if (currentAppId && comment) {
            const response = await postData('reviewApplication', {
                applicationId: currentAppId,
                action: 'comment',
                username: user_name,
                comment,
            });

            if (response.reviewSuccess) {
                setSnackbarMessage('Comment submitted successfully!');
                setSnackbarSeverity('success');
                // Re-fetch data to update the list
                const data = await fetchDataByButtonType(btn_type, user_name);
                setApplications(data.applicationList || []);
            } else {
                setSnackbarMessage('Failed to submit comment. Please try again.');
                setSnackbarSeverity('error');
            }

            setSnackbarOpen(true);
            handleDialogClose();
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
            <Typography variant="h4">Applications</Typography>
            {applications.length === 0 ? (
                <Typography>No applications yet</Typography>
            ) : (
                applications.map((app) => (
                    <Card key={app.applicationId} style={{ margin: '10px 0' }}>
                        <CardContent>
                            <Typography variant="h5">{app.eventName}</Typography>
                            <Typography color="textSecondary">{app.applicationId}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Status: {app.eventStatus}
                            </Typography>
                            {app.financialComment && (
                                <Typography variant="body2" color="textSecondary">
                                    Financial comment: {app.financialComment}
                                </Typography>
                            )}
                            {app.needReview && app.eventStatus === 'reviewing' && (
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDialogOpen(app.applicationId)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Comment
                                    </Button>

                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Submit Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your comment for application ID: {currentAppId}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Comment"
                        fullWidth
                        variant="standard"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCommentSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ContentFM;