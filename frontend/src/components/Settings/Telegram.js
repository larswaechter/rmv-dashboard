import { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SettingsTelegram = ({ settings, onInputChange, onSettingUpdate }) => {
  const [showKey, setShowKey] = useState(false);

  const handleInputChange = (value, i) => {
    const setting = { ...settings[i] };
    setting['value'] = value;
    onInputChange(setting);
  };

  const handleInputBlur = (i) => {
    onSettingUpdate(settings[i]);
  };

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        Telegram
      </Typography>
      {settings.map((setting, i) =>
        setting.hidden ? (
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" key={setting.key}>
            <InputLabel>{setting.description}</InputLabel>
            <OutlinedInput
              type={showKey ? 'text' : 'password'}
              label={setting.description}
              value={setting.value || setting.default || ''}
              onChange={(e) => handleInputChange(e.target.value, i)}
              onBlur={() => handleInputBlur(i)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowKey(!showKey)}
                    edge="end"
                  >
                    {showKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        ) : (
          <TextField
            key={setting.key}
            label={setting.description}
            value={setting.value || setting.default || ''}
            onChange={(e) => handleInputChange(e.target.value, i)}
            onBlur={() => handleInputBlur(i)}
          />
        )
      )}
    </div>
  );
};

SettingsTelegram.propTypes = {
  settings: PropTypes.array,
  onInputChange: PropTypes.func,
  onSettingUpdate: PropTypes.func
};

export default SettingsTelegram;
