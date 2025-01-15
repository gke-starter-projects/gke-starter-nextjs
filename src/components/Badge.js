'use client';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// Create a styled "span" component with Material-UI
const StyledBadge = styled('span')(({ theme, color }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: color,
  color: theme.palette.common.white,
  fontSize: theme.typography.pxToRem(12),
  display: 'inline-block',
}));

function Badge({ color, children }) {
  return (
    <StyledBadge color={color}>
      <Typography variant="body2">{children}</Typography>
    </StyledBadge>
  );
}

Badge.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Badge;
