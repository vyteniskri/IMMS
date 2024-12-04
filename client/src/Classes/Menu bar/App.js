import { Routes, Route } from 'react-router-dom';
import React from 'react';
import HomeScreen from '../Home screen/HomeScreen';
import Menu from './Menu';
import AllSubjectsList from '../Subject/AllSubjectsList';
import SingleSubjectInfo from '../Subject/SingleSubjectInfo';

const App = () => {
  return (
    <>
      <Menu />
      <Routes>
        <Route path='/' element={<HomeScreen/>} />
        <Route path='/AllSubjects' element={<AllSubjectsList/>} />
        <Route path='/AllSubjects/:subjectId' element={<SingleSubjectInfo/>} />
      </Routes>
    </>
  );
}

export default App;
