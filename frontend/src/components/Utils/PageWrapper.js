import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const PageWrapper = ({ isLoading, error, onRetry, children }) => {
  if (isLoading)
    return (
      <div style={{ textAlign: 'center', padding: '20vh 0px' }}>
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );

  return children;
};

PageWrapper.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  children: PropTypes.element
};

export default PageWrapper;
