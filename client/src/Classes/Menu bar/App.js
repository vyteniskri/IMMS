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
      <header>
        <div className="menu-header">
          <h1 className="menu-logo">OSLS</h1>
        </div>
      </header>
      
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

      <footer>
        <p>© 2024 Online Student Learning site</p>
      </footer>
    </>
  );
}

export default App;

//TODO: 
// patalpint clienta i clouda,
// padaryt ataskaita ir shemu pabraizyt
///Header, Content, Footer srityse stilius turėtų būti skirtingas (specifiškas). Srityse turėtų būti bent po keletą skirtingų elementų. Analogiški elementai skirtingose srityse turėtų įgauti skirtingą išvaizdą.
