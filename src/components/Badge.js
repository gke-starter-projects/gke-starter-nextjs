'use client';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// import { useState } from 'react';

// Create a styled "span" component with Material-UI
const StyledBadge = styled('span')(({ theme, color }) => ({
  padding: theme.spacing(0.25, 0.25),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: color,
  color: theme.palette.common.white,
  fontSize: theme.typography.pxToRem(12),
  display: 'inline-block',
}));

// const syncWithDatabase = (id, newText) => {
//   ...
// }

function Badge({ id, color, children }) {
  // const [text, setText] = useState(children);

  // const handleChange = (newText) => {
  //   syncWithDatabase(id, newText);
  // };

  return (
    <StyledBadge id={id} color={color}>
      <Typography variant="body2">{children}</Typography>
    </StyledBadge>
  );
}

Badge.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Badge;
