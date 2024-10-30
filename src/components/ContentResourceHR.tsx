import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { fetchDataByButtonType, postData } from '../apiService';

interface SepReqVO {
    requestId: string;
    requestName: string;
    requestDesc: string;
    applicationId: string;
    status: string;
}

interface ContentResourceHRProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentResourceHR: React.FC<ContentResourceHRProps> = ({ btn_type, user_name }) => {
    const [requests, setRequests] = useState<SepReqVO[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [newDepartment, setNewDepartment] = useState('');

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

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewEmployeeName('');
        setNewDepartment('');
    };

    const handleRecruitEmployee = async () => {
        const response = await postData('recruitEmp', {
            name: newEmployeeName,
            department: newDepartment,
        });

        if (response.recruitSuccess) {
            setSnackbarMessage('Employee recruited successfully!');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage('Failed to recruit employee.');
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
            <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
                style={{ position: 'fixed', bottom: '20px', left: '50%' }}
            >
                Recruit Employee
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Recruit Employee</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Employee Name"
                        fullWidth
                        margin="normal"
                        value={newEmployeeName}
                        onChange={(e) => setNewEmployeeName(e.target.value)}
                    />
                    <TextField
                        label="Department"
                        fullWidth
                        margin="normal"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRecruitEmployee} color="primary">
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

export default ContentResourceHR;
