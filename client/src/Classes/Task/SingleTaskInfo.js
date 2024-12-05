import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../Css styles/ListAllItems.css';
import AllCommentsList from '../Comment/AllCommentsList';

const SingleTaskInfo = () => {
    const { subjectId, taskId } = useParams();
    const [task, setTask] = useState(null);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}`)
          .then(response => {
            setTask(response.data);
          })
          .catch(error => {
            console.error('Error fetching subject:', error);
          });
  
      }, [subjectId, taskId]);


      return (
        task ? (
            <>
          <div className="item-details-container">
            <h1>{task.title}</h1>
            <p className='description'><b>Description:</b> {task.description}</p>
            <p className='date'><b>Published:</b> {new Date(task.createdOn).toLocaleDateString()}</p>
          </div>
            <div className='open-button-container'>
                <button className='open-button' onClick={() => setIsCommentsOpen(true)}>View Comments</button>
            </div>
            {isCommentsOpen && (
              <AllCommentsList 
                subjectId={subjectId}
                taskId={taskId}
                onClose={() => setIsCommentsOpen(false)}
              />
            )}

            </>

        ) : ( " " )
      );
};

export default SingleTaskInfo;