import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;
