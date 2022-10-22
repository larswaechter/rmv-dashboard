import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const SettingsTelegram = ({ settings, onInputChange, onSettingUpdate }) => {
  const handleInputChange = (value, i) => {
    const setting = { ...settings[i] };
    setting["value"] = value;
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
      {settings.map((setting, i) => (
        <TextField
          key={setting.key}
          id="outlined-required"
          label={setting.description}
          value={setting.value || setting.default || ""}
          onChange={(e) => handleInputChange(e.target.value, i)}
          onBlur={() => handleInputBlur(i)}
        />
      ))}
    </div>
  );
};

export default SettingsTelegram;
