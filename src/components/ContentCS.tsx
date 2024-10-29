import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { fetchDataByButtonType, postData } from '../apiService';

interface ApplicationVO {
    applicationId: string;
    eventName: string;
    eventDesc: string;
    eventStatus: string;
    needReview: boolean;
    showSetStatus: boolean;
    nextStatus: string;
}

interface ContentCSProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentCS: React.FC<ContentCSProps> = ({ btn_type, user_name }) => {
    const [applications, setApplications] = useState<ApplicationVO[]>([]);
    const [open, setOpen] = useState(false);
    const [newEventName, setNewEventName] = useState('');
    const [newEventDesc, setNewEventDesc] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchData = async () => {
            if (btn_type && user_name) {
                const data = await fetchDataByButtonType(btn_type, user_name);
                setApplications(data.applicationList || []);
            }
        };

        fetchData();
    }, [btn_type, user_name]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleCreateClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        const newApplication = { eventName: newEventName, eventDesc: newEventDesc };
        const response = await postData('createApplication', newApplication);

        if (response.createSuccess) {
            setSnackbarMessage('Application created successfully!');
            handleClose();
            setSnackbarSeverity('success');
            setNewEventName('');
            setNewEventDesc('');
            // Re-fetch data to update the list
            const data = await fetchDataByButtonType(btn_type, user_name);
            setApplications(data.applicationList || []);
        } else {
            setSnackbarMessage('Failed to create application. Please try again.');
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
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
                            <Typography color="textSecondary">Application ID: {app.applicationId}</Typography>
                            <Typography color="textSecondary">
                                Status: {app.eventStatus}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateClick}
                style={{ position: 'fixed', bottom: '20px', left: '60%', transform: 'translateX(-50%)' }}
            >
                Create New Application
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Application</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Event Name"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Event Description"
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ContentCS;
