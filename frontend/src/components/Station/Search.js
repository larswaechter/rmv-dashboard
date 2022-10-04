import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { searchStations } from "../../services/station";

const StationSearch = ({ handleChange }) => {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(inputValue);
      doSearch();
    }, 750);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const doSearch = async () => {
    if (inputValue.length) {
      const res = await searchStations(inputValue);
      setStations(res);
    } else setStations([]);
  };

  return (
    <Autocomplete
      freeSolo
      options={stations.map((option) => option.name)}
      value={value}
      inputValue={inputValue}
      onChange={(_, newValue) => {
        setValue(newValue);
        handleChange(stations.find((station) => station.name === newValue));
      }}
      onInputChange={(_, value) => setInputValue(value)}
      renderInput={(params) => <TextField {...params} label="Station" />}
    />
  );
};

export default StationSearch;
