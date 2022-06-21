import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { debounce } from 'debounce';
import { saveReduxState } from './shared/functions/browserStorage';
store.subscribe(
	// we use debounce to save the state once each 800ms
	// for better performances in case multiple changes occur in a short time
	debounce(() => {
		saveReduxState(store.getState());
	}, 800),
);
const container = document.getElementById('root')!;
const root = createRoot(container);
const isStrictMode = true;
if (isStrictMode) {
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>,
	);
} else {
	root.render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
