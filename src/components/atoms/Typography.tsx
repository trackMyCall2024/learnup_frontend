import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

export const H1: React.FC<TypographyProps> = (props) => (
    <Typography variant="h1" fontSize="36px" fontWeight={600} {...props} />
);

export const H2: React.FC<TypographyProps> = (props) => (
    <Typography variant="h2" fontSize="30px" {...props} />
);

export const H3: React.FC<TypographyProps> = (props) => (
    <Typography variant="h3" fontSize="24px" {...props} />
);

export const H4: React.FC<TypographyProps> = (props) => (
    <Typography variant="h4" fontSize="20px" {...props} />
);

export const H5: React.FC<TypographyProps> = (props) => (
    <Typography variant="h5" fontSize="16px" {...props} />
);

export const H6: React.FC<TypographyProps> = (props) => (
    <Typography variant="h6" fontSize="14px" {...props} />
);

export const LargeText: React.FC<TypographyProps> = (props) => (
    <Typography variant="body1" component="span" fontSize="16px" {...props} />
);

export const Text: React.FC<TypographyProps> = (props) => (
    <Typography variant="body1" component="span" fontSize="14px" {...props} />
);

export const SmallText: React.FC<TypographyProps> = (props) => (
    <Typography variant="body1" component="span" fontSize="12px" {...props} />
);

export const Paragraph: React.FC<TypographyProps> = (props) => (
    <Typography variant="body1" component="p" fontSize="14px" {...props} />
);

export const Span: React.FC<TypographyProps> = (props) => (
    <Typography variant="body1" component="span" fontSize="14px" {...props} />
);

export const EllipsisText: React.FC<TypographyProps> = (props) => (
    <Typography
        variant="body1"
        component="span"
        fontSize="14px"
        {...props}
        sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ...props.sx,
        }}
    />
);
