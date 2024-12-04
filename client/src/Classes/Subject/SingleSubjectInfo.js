
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Css styles/ListAllItems.css';

const SingleSubjectInfo = () => {
    const [subject, setSubject] = useState(null);
    const { subjectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}`)
        .then(response => {
          setSubject(response.data); 
        })
        .catch(error => {
          console.error('Error fetching subject:', error);
        });

    }, [subjectId]);

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks`)
          .then(response => {
            setTasks(response.data); 
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error fetching subject:', error);
          });
  
      }, []);

    const handleSubjectClick = (subjectId) => {
        navigate(`/AllSubjects/${subjectId}`); 
    };

    return (
        subject ? (
            <>

          <div className="item-details-container">
            <h1>{subject.title}</h1>
            <p className='description'><b>Description:</b> {subject.description}</p>
            <p className='date'><b>Published:</b> {new Date(subject.createdOn).toLocaleDateString()}</p>
          </div>

            <div className="all-items-container">
                <h1>Select a task to learn</h1>
                <div className="items-list">
                    {tasks.map(subject => (
                    <div
                        key={subject.id}
                        className="single-item"
                        onClick={() => handleSubjectClick(subject.id)} >
                        <h2>{subject.title}</h2>
                    </div>
                    ))}
                </div>
            </div>
          </>
        ) : ( " " )
      );

};

export default SingleSubjectInfo;