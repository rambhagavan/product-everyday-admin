import { Box, Typography, styled } from '@mui/material';
import { Span } from './Typography';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import { APPNAME } from '../../core/constants';

const BrandRoot = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 18px 20px 29px',
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: '.5rem',
  display: mode === 'compact' ? 'none' : 'block',
}));

const Brand = ({ children }) => {
  const { settings } = useSettings();
  const leftSidebar = settings.layoutSettings.leftSidebar;
  const { mode } = leftSidebar;
  const [textmode, settextmode] = useState("white")

  useEffect(() => {
    const theme = settings.layoutSettings.leftSidebar.theme
    if (theme === "slateDark1" || theme === 'slateDark2' || theme === 'purpleDark1' || theme === 'purpleDark2' || theme === 'blueDark') {
      settextmode("dark")
    } else {
      settextmode('white')
    }

  }, [])

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        {/* <MatxLogo /> */}
        <StyledSpan mode={mode} className="sidenavHoverShow">
          <Typography>
            <h6 className={textmode === 'dark' ? 'text-white' : 'text-blue'}><b>{APPNAME}</b></h6>
          </Typography>
        </StyledSpan>
      </Box>

      <Box className="sidenavHoverShow" sx={{ display: mode === 'compact' ? 'none' : 'block' }}>
        {children || null}
      </Box>
    </BrandRoot>
  );
};

export default Brand;
