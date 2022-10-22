import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import { getSettings, updateSetting } from "../services/settings";
import SettingsTelegram from "../components/Settings/Telegram";
import SettingsDiscord from "../components/Settings/Discord";
import { Stack } from "@mui/system";

const PagesSettings = () => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const [showSnack, setShowSnack] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
      setSettings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setting) => {
    const copy = settings.slice();
    const idx = settings.findIndex((s) => s.key === setting.key);

    copy[idx] = setting;
    setSettings(copy);
  };

  const handleSettingUpdate = async ({ key, value }) => {
    try {
      setUpdateError(null);
      await updateSetting(key, value);
    } catch (err) {
      console.error(err);
      setUpdateError(err);
    } finally {
      setShowSnack(true);
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") return;
    setShowSnack(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "20vh 0px" }}>
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => fetchData()}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );

  return (
    <div className="PagesSettings">
      <Typography variant="h5" component="h1" marginBottom={"16px"}>
        Settings
      </Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Stack spacing={2}>
          <SettingsDiscord
            settings={settings.filter(({ group }) => group === "discord")}
            onInputChange={handleInputChange}
            onSettingUpdate={handleSettingUpdate}
          />
          <SettingsTelegram
            settings={settings.filter(({ group }) => group === "telegram")}
            onInputChange={handleInputChange}
            onSettingUpdate={handleSettingUpdate}
          />
        </Stack>
      </Box>
      <Snackbar
        open={showSnack}
        onClose={handleSnackClose}
        message={updateError ? updateError : "Settings updated"}
        autoHideDuration={3000}
      />
    </div>
  );
};

export default PagesSettings;