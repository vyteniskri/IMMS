
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../Css styles/ListAllItems.css';
import AllTasksList from '../Task/AllTasksList';

const SingleSubjectInfo = () => {
    const [subject, setSubject] = useState(null);
    const { subjectId } = useParams();

    useEffect(() => {
      axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}`)
        .then(response => {
          setSubject(response.data); 
        })
        .catch(error => {
          console.error('Error fetching subject:', error);
        });

    }, [subjectId]);


    return (
        subject ? (
            <>

          <div className="item-details-container">
            <h1>{subject.title}</h1>
            <p className='description'><b>Description:</b> {subject.description}</p>
            <p className='date'><b>Published:</b> {new Date(subject.createdOn).toLocaleDateString()}</p>
          </div>

          <AllTasksList subjectId={subjectId}/>

          </>
        ) : ( " " )
      );

};

export default SingleSubjectInfo;