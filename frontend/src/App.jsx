import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Newsapp from './Components/Newsapp';
import ReadMore from './Components/ReadMore';
import SignIn from './login/SignIn';
import Signup from './login/Signup';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define routes for Newsapp and ReadMore */}
          <Route path="/" element={<Newsapp />} />
          <Route path="/read-more/:id" element={<ReadMore />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
