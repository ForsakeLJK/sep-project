import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import { fetchDataByButtonType, postData } from '../apiService';

interface SepReqVO {
    requestId: string;
    requestName: string;
    requestDesc: string;
    applicationId: string;
    status: string;
}

interface ContentResourcePMProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentResourcePM: React.FC<ContentResourcePMProps> = ({ btn_type, user_name }) => {
    const [requests, setRequests] = useState<SepReqVO[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newRequestName, setNewRequestName] = useState('');
    const [newApplicationId, setNewApplicationId] = useState('');
    const [newRequestDesc, setNewRequestDesc] = useState('');
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

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewRequestName('');
        setNewApplicationId('');
        setNewRequestDesc('');
    };

    const handleRequestSubmit = async () => {
        const response = await postData('createReq', {
            requestName: newRequestName,
            requestDesc: newRequestDesc,
            applicationId: newApplicationId,
            username: user_name,
            type: 'resource',
        });

        if (response.createSuccess) {
            setSnackbarMessage('Resource request submitted successfully!');
            setSnackbarSeverity('success');
            fetchRequests(); // Re-fetch to update the list
        } else {
            setSnackbarMessage('Failed to submit resource request.');
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
        handleDialogClose();
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
            <Typography variant="h4">Resource Requests</Typography>
            {requests.length === 0 ? (
                <Typography>No resource requests available</Typography>
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
                        </CardContent>
                    </Card>
                ))
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
                style={{ position: 'fixed', bottom: '20px', left: '50%' }}
            >
                Create Resource Request
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Create Resource Request</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Request Name"
                        fullWidth
                        margin="normal"
                        value={newRequestName}
                        onChange={(e) => setNewRequestName(e.target.value)}
                    />
                    <TextField
                        label="Application ID"
                        fullWidth
                        margin="normal"
                        value={newApplicationId}
                        onChange={(e) => setNewApplicationId(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={newRequestDesc}
                        onChange={(e) => setNewRequestDesc(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRequestSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
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

export default ContentResourcePM;