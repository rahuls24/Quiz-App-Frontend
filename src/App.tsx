import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import { defaultTheme } from './shared/components/globalTheme';
import Signin from './features/auth/signin/Signin';
import Signup from './features/auth/signup/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizMakerPage from './pages/QuizMakerPage';
import RequireAuth from './features/auth/RequireAuth';

function App() {
	return (
		<>
			<ThemeProvider theme={defaultTheme}>
				<BrowserRouter>
					<Routes>
						<Route
							path='/'
							element={
								<RequireAuth>
									<HomePage />
								</RequireAuth>
							}
						></Route>
						<Route path='auth/signin' element={<Signin />} />
						<Route path='auth/signup' element={<Signup />} />
						<Route
							path='quiz/make-a-quiz'
							element={
								<RequireAuth>
									<QuizMakerPage />
								</RequireAuth>
							}
						/>
						<Route path='*' element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}

export default App;

function NotFound() {
	return <h1>Page no found</h1>;
}
