import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { store } from '@ReduxStore/store';
import { saveReduxState } from '@SharedFunction/browserStorage';
import { debounce } from 'debounce';
import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
store.subscribe(
    // we use debounce to save the state once each 800ms
    // for better performances in case multiple changes occur in a short time
    debounce(() => {
        saveReduxState(store.getState());
    }, 800)
);
const container = document.getElementById('root')!;
const root = createRoot(container);
const isStrictMode = false;
if (isStrictMode) {
    root.render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>
    );
} else {
    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
