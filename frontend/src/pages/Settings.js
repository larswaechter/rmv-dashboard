import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import { Stack } from '@mui/system';

import SettingsTelegram from '../components/Settings/Telegram';
import SettingsDiscord from '../components/Settings/Discord';
import PageWrapper from '../components/Utils/PageWrapper';

import { getSettings, updateSetting } from '../services/settings';

const PagesSettings = () => {
  const [settings, setSettings] = useState([]);
  const [initSettings, setInitSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const [showSnack, setShowSnack] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getSettings();
      setSettings(data);
      setInitSettings(data);
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

  const handleSettingUpdate = async (setting) => {
    const { key, value } = setting;

    // Check if value has changed
    const initSettingIdx = initSettings.findIndex((s) => s.key === key);
    if (initSettings[initSettingIdx].value === value) return;

    try {
      setUpdateError(null);
      await updateSetting(key, value);

      const copy = initSettings.slice();
      copy[initSettingIdx] = setting;
      setInitSettings(copy);
    } catch (err) {
      console.error(err);
      setUpdateError(err);
    } finally {
      setShowSnack(true);
    }
  };

  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') return;
    setShowSnack(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageWrapper isLoading={isLoading} error={error} onRetry={fetchData}>
      <div className="PagesSettings">
        <Typography variant="h5" component="h1" marginBottom={'16px'}>
          Settings
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' }
          }}
          noValidate
          autoComplete="off"
        >
          <Stack spacing={2}>
            <SettingsDiscord
              settings={settings.filter(({ group }) => group === 'discord')}
              onInputChange={handleInputChange}
              onSettingUpdate={handleSettingUpdate}
            />
            <SettingsTelegram
              settings={settings.filter(({ group }) => group === 'telegram')}
              onInputChange={handleInputChange}
              onSettingUpdate={handleSettingUpdate}
            />
          </Stack>
        </Box>
        <Snackbar
          open={showSnack}
          onClose={handleSnackClose}
          message={updateError ? updateError : 'Settings updated'}
          autoHideDuration={3000}
        />
      </div>
    </PageWrapper>
  );
};

export default PagesSettings;
