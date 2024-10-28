import React from 'react';
import { Typography } from '@mui/material';

interface ContentCSProps {
    data?: Record<string, any>;
}

const ContentCS: React.FC<ContentCSProps> = ({ data }) => {
    if (!data) {
        return <Typography>No data</Typography>;
    }

    return (
        <div>
            <Typography variant="h6">{data.title}</Typography>
            <Typography>{data.description}</Typography>
        </div>
    );
};

export default ContentCS;