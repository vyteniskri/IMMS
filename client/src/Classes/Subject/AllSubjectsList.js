import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css styles/ListAllItems.css';
import { useNavigate } from 'react-router-dom';

const AllSubjectsList = () => {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      axios.get('https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects')
        .then(response => {
          setSubjects(response.data); 
        })
        .catch(error => {
          console.error('Error fetching subjects:', error);
        });
    }, []); 

    const handleSubjectClick = (subjectId) => {
        navigate(`/AllSubjects/${subjectId}`); 
    };
  
    return (
        <div className="all-items-container">
          <h1>Select a subject to learn</h1>
          <div className="items-list">
            {subjects.map(subject => (
              <div
                key={subject.id}
                className="single-item"
                onClick={() => handleSubjectClick(subject.id)} >
                <h2>{subject.title}</h2>
              </div>
            ))}
          </div>
        </div>
      );
};

export default AllSubjectsList;
