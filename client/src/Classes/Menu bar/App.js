import { Routes, Route } from 'react-router-dom';
import React from 'react';
import HomeScreen from '../Home screen/HomeScreen';
import Menu from './Menu';
import AllSubjectsList from '../Subject/AllSubjectsList';
import SingleSubjectInfo from '../Subject/SingleSubjectInfo';
import SingleTaskInfo from '../Task/SingleTaskInfo';
import SingleCommentInfo from '../Comment/SingleCommentInfo';

const App = () => {
  return (
    <>
      <Menu />
      <Routes>
        <Route path='/' element={<HomeScreen/>} />
        <Route path='/AllSubjects' element={<AllSubjectsList/>} />
        <Route path='/AllSubjects/:subjectId' element={<SingleSubjectInfo/>} />
        <Route path='/AllSubjects/:subjectId/AllTasks/:taskId' element={<SingleTaskInfo/>} />
        <Route path='/AllSubjects/:subjectId/AllTasks/:taskId/AllComments/:commentId' element={<SingleCommentInfo/>} />
      </Routes>
    </>
  );
}

export default App;
