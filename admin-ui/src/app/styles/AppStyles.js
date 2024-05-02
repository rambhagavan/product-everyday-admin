import { Box, styled, useTheme } from '@mui/material';

export const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

export const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

export const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

export const JWTRoot = styled(JustifyBox)(() => ({
  background: 'white',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 300,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center'
  }
}));