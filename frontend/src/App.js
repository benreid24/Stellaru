import React from 'react';
import {createMuiTheme} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SaveChooser from './SaveChooser/SaveChooser';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <SaveChooser></SaveChooser>
      </div>
    </ThemeProvider>
  );
}

export default App;
