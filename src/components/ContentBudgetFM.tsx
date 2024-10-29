import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Snackbar, Alert } from '@mui/material';
import { fetchDataByButtonType, postData } from '../apiService';

interface SepReqVO {
    requestId: string;
    requestName: string;
    requestDesc: string;
    applicationId: string;
    status: string;
}

interface ContentBudgetFMProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentBudgetFM: React.FC<ContentBudgetFMProps> = ({ btn_type, user_name }) => {
    const [requests, setRequests] = useState<SepReqVO[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchRequests();
    }, [btn_type, user_name]);

    const fetchRequests = async () => {
        if (btn_type && user_name) {
            const data = await fetchDataByButtonType(btn_type, user_name);
            setRequests(data.sepReqList || []);
        }
    };

    const handleStatusChange = async (requestId: string, action: 'approve' | 'reject') => {
        const response = await postData('changeReqStatus', {
            requestId,
            action,
            username: user_name,
        });

        if (response.changeSuccess) {
            setSnackbarMessage(`Request ${action} successfully!`);
            setSnackbarSeverity('success');
            fetchRequests(); // Re-fetch to update the list
        } else {
            setSnackbarMessage(`Failed to ${action} request.`);
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
            <Typography variant="h4">Budget Requests</Typography>
            {requests.length === 0 ? (
                <Typography>No budget requests available</Typography>
            ) : (
                requests.map((request) => (
                    <Card key={request.requestId} style={{ margin: '10px 0' }}>
                        <CardContent>
                            <Typography variant="h5">{request.requestName}</Typography>
                            <Typography color="textSecondary">Application ID: {request.applicationId}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Description: {request.requestDesc}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Status: {request.status}
                            </Typography>
                            {request.status === 'reviewing' && (
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleStatusChange(request.requestId, 'approve')}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleStatusChange(request.requestId, 'reject')}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ContentBudgetFM;
