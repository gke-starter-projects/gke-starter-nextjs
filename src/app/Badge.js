import PropTypes from 'prop-types';
const Badge = ({ color, children }) => (
    <span 
      className="px-2 py-1 rounded text-white text-sm"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
  
  Badge.propTypes = {
    color: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  export default Badge;
