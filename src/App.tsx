import RequireAuth from '@Feature/auth/RequireAuth';
import Signin from '@Feature/auth/signin/Signin';
import Signup from '@Feature/auth/signup/Signup';
import { ThemeProvider } from '@mui/material/styles';
import HomePage from '@Page/HomePage';
import PageNotFound from '@Page/PageNotFound';
import QuizHistory from '@Page/QuizHistory';
import QuizMakerPage from '@Page/QuizMakerPage';
import QuizResultPage from '@Page/QuizResultPage';
import StartQuiz from '@Page/StartQuiz';
import { defaultTheme } from '@SharedComponent/globalTheme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          ></Route>
          <Route path="auth/signin" element={<Signin />} />
          <Route path="auth/signup" element={<Signup />} />
          <Route
            path="quiz/make-a-quiz"
            element={
              <RequireAuth>
                <QuizMakerPage />
              </RequireAuth>
            }
          />
          <Route
            path="quiz/start/:quizId/"
            element={
              <RequireAuth>
                <StartQuiz />
              </RequireAuth>
            }
          />
          <Route
            path="quiz/result"
            element={
              <RequireAuth>
                <QuizResultPage />
              </RequireAuth>
            }
          />
          <Route
            path="quiz/history"
            element={
              <RequireAuth>
                <QuizHistory />
              </RequireAuth>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </ThemeProvider>
  );
}

export default App;
