import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.scss';
import { App } from './App.tsx';
import { saveState, debounce } from './store/localStorage.ts'
import { store } from './store/store.ts';

store.subscribe(
  debounce(() => {
    saveState(store.getState());
  }, 500)
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
);
