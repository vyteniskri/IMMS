import { Routes, Route } from 'react-router-dom';
import React from 'react';
import HomeScreen from '../Home screen/HomeScreen';
import Menu from './Menu';
import AllSubjectsList from '../Subject/AllSubjectsList';
import SingleSubjectInfo from '../Subject/SingleSubjectInfo';
import SingleTaskInfo from '../Task/SingleTaskInfo';
import SingleCommentInfo from '../Comment/SingleCommentInfo';
import Login from '../Auth/Login';
import Register from '../Auth/Register';

const App = () => {
  return (
    <>
      <Menu />
      <Routes>
        <Route path='/' element={<HomeScreen/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/Register' element={<Register/>} />

        <Route path='/AllSubjects' element={<AllSubjectsList/>} />
        <Route path='/AllSubjects/:subjectId' element={<SingleSubjectInfo/>} />
        <Route path='/AllSubjects/:subjectId/AllTasks/:taskId' element={<SingleTaskInfo/>} />
        <Route path='/AllSubjects/:subjectId/AllTasks/:taskId/AllComments/:commentId' element={<SingleCommentInfo/>} />
      </Routes>
    </>
  );
}

export default App;

//TODO: papushint serveri kad DigitalOcian matytu, pakeisti dizaina puslapio bsk (image ir t.t.), padaryt refreshToken kvietima i serveri, 
// pakeist cliento api kvietimus (register, login ir lougout) patalpint clienta i clouda,
// padaryt ataskaita ir shemu pabraizyt
