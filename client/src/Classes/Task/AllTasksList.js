
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllTasksList = ({subjectId}) => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks`)
          .then(response => {
            setTasks(response.data); 
          })
          .catch(error => {
            console.error('Error fetching subject:', error);
          });
  
      }, [subjectId]);

    const handleTaskClick = (taskId) => {
        navigate(`/AllSubjects/${subjectId}/AllTasks/${taskId}`); 
    };

    return (
            <div className="all-items-container">
                <h1>Select a task to learn</h1>
                <div className="items-list">
                    {tasks.map(task => (
                    <div
                        key={task.id}
                        className="single-item"
                        onClick={() => handleTaskClick(task.id)} >
                        <h2>{task.title}</h2>
                    </div>
                    ))}
                </div>
            </div>
    );
};

export default AllTasksList;