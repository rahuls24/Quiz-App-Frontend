import { RootState } from '@ReduxStore/store';

const KEY = 'quiz-app';
export function loadReduxState() {
	try {
		const serializedState = sessionStorage.getItem(KEY);
		if (!serializedState) return undefined;
		return JSON.parse(serializedState);
	} catch (e) {
		return undefined;
	}
}

export async function saveReduxState(state: RootState) {
	try {
		const serializedState = JSON.stringify(state);
		sessionStorage.setItem(KEY, serializedState);
	} catch (e) {
		// Ignore the error
	}
}
