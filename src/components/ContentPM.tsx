import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Snackbar, Alert, Popover, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { fetchDataByButtonType, fetchEmpData, postData } from '../apiService';

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

interface EmpVO {
    name: string;
    department: string;
}

interface TaskVO {
    taskName: string;
    taskDesc: string;
    taskId: string;
    assignee: string;
    comment: string;
}

interface ContentPMProps {
    btn_type: string | null;
    user_name: string | null;
}

const ContentPM: React.FC<ContentPMProps> = ({ btn_type, user_name }) => {
    const [applications, setApplications] = useState<ApplicationVO[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [employees, setEmployees] = useState<EmpVO[]>([]);
    const [department, setDepartment] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [tasks, setTasks] = useState<TaskVO[]>([]);
    const [taskPopoverOpen, setTaskPopoverOpen] = useState(false);
    const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (btn_type && user_name) {
                const data = await fetchDataByButtonType(btn_type, user_name);
                setApplications(data.applicationList || []);
            }
        };

        fetchData();
    }, [btn_type, user_name]);

    const handleAssignTaskOpen = async (event: React.MouseEvent<HTMLButtonElement>, applicationId: string) => {
        setAnchorEl(event.currentTarget);
        const response = await fetchEmpData('employee', user_name, applicationId);
        setEmployees(response.empList || []);
        setCurrentApplicationId(applicationId);
    };

    const handleAssignTaskClose = () => {
        setAnchorEl(null);
        setDepartment('');
        setEmployeeName('');
        setTaskName('');
        setTaskDesc('');
        setCurrentApplicationId(null);
    };

    const handleTaskSubmit = async (applicationId: string | null) => {
        const response = await postData('taskAssign', {
            username: user_name,
            taskName,
            taskDesc,
            employeeName,
            applicationId
        });

        if (response.assignSuccess) {
            setSnackbarMessage('Task assigned successfully!');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage('Failed to assign task.');
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
        handleAssignTaskClose();
    };

    const handleViewTasksOpen = async (applicationId: string) => {
        const response = await postData('/taskList', { applicationId, username: user_name });
        setTasks(response.taskList || []);
        setTaskPopoverOpen(true);
    };

    const handleTaskPopoverClose = () => {
        setTaskPopoverOpen(false);
        setTasks([]);
    };

    const handleChangeStatus = async (applicationId: string, newStatus: string) => {
        const response = await postData('/changeStatus', { username: user_name, applicationId });

        if (response.success) {
            setSnackbarMessage(`Status changed to ${newStatus} successfully!`);
            setSnackbarSeverity('success');
            const data = await fetchDataByButtonType(btn_type, user_name);
            setApplications(data.applicationList || []);
        } else {
            setSnackbarMessage('Failed to change status.');
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
    };

    const uniqueDepartments = employees.reduce<string[]>((acc, emp) => {
        if (!acc.includes(emp.department)) {
            acc.push(emp.department);
        }
        return acc;
    }, []);

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
            <Typography variant="h4">Project Manager Applications</Typography>
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
                            <div>
                                {(app.eventStatus === 'open' || app.eventStatus === 'in progress') && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => handleAssignTaskOpen(e, app.applicationId)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Assign Task
                                    </Button>
                                )}
                                {(app.eventStatus === 'open' || app.eventStatus === 'in progress') && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewTasksOpen(app.applicationId)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        View Tasks
                                    </Button>
                                )}
                                {app.eventStatus === 'open' && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleChangeStatus(app.applicationId, 'in progress')}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Set In Progress
                                    </Button>
                                )}
                                {app.eventStatus === 'in progress' && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleChangeStatus(app.applicationId, 'closed')}
                                    >
                                        Close
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleAssignTaskClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ padding: '20px' }}>
                    <Typography variant="h6">Assign Task</Typography>
                    <TextField
                        label="Task Name"
                        fullWidth
                        margin="normal"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TextField
                        label="Task Description"
                        fullWidth
                        margin="normal"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                    />
                    <TextField
                        select
                        label="Department"
                        fullWidth
                        margin="normal"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        {uniqueDepartments.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Employee"
                        fullWidth
                        margin="normal"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        disabled={!department}
                    >
                        {employees
                            .filter((emp) => emp.department === department)
                            .map((emp) => (
                                <MenuItem key={emp.name} value={emp.name}>
                                    {emp.name}
                                </MenuItem>
                            ))}
                    </TextField>
                    <Button variant="contained" color="primary" onClick={() => handleTaskSubmit(currentApplicationId)}>
                        Submit
                    </Button>
                </div>
            </Popover>
            <Popover
                open={taskPopoverOpen}
                onClose={handleTaskPopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: '20px', maxWidth: '600px' }}>
                    <Typography variant="h6">Tasks</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Task Name</TableCell>
                                <TableCell>Task Description</TableCell>
                                <TableCell>Assignee</TableCell>
                                <TableCell>Comment</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.taskId}>
                                    <TableCell>{task.taskName}</TableCell>
                                    <TableCell>{task.taskDesc}</TableCell>
                                    <TableCell>{task.assignee}</TableCell>
                                    <TableCell>{task.comment}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Popover>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ContentPM;
