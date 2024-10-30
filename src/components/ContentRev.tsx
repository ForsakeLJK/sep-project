import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Snackbar, Alert } from '@mui/material';
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

interface ContentRevProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentRev: React.FC<ContentRevProps> = ({ btn_type, user_name }) => {
    const [applications, setApplications] = useState<ApplicationVO[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
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

    const handleReview = async (applicationId: string, action: 'approve' | 'reject') => {
        const response = await postData('reviewApplication', { applicationId, action, username: user_name });

        if (response.reviewSuccess) {
            setSnackbarMessage(`Application ${action} successfully!`);
            setSnackbarSeverity('success');
            // Re-fetch data to update the list
            const data = await fetchDataByButtonType(btn_type, user_name);
            setApplications(data.applicationList || []);
        } else {
            setSnackbarMessage(`Failed to ${action} application. Please try again.`);
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
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
                            <Typography color="textSecondary">Application ID: {app.applicationId}</Typography>
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
                                        onClick={() => handleReview(app.applicationId, 'approve')}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleReview(app.applicationId, 'reject')}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
                open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ContentRev;