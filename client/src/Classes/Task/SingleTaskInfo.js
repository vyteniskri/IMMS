import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Css styles/ListAllItems.css';
import '../../Css styles/SingleTask.css';
import AllCommentsList from '../Comment/AllCommentsList';

const SingleTaskInfo = () => {
    const { subjectId, taskId } = useParams();
    const [task, setTask] = useState(null);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}`)
          .then(response => {
            setTask(response.data);
          })
          .catch(error => {
            console.error('Error fetching subject:', error);
          });
  
      }, [subjectId, taskId]);


      const handleUpdateTask = () => {
        const token = localStorage.getItem("accessToken");
      
          const updateTask = { description: newTaskDescription };
          axios
            .put(
              `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}`,
              updateTask,
              {
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
              }
            )
            .then((response) => {
              setTask(response.data);
              setErrorMessage("");
              setNewTaskDescription("");
              setErrorMessageDescription("");
              setIsUpdateOpen(false);
            })
            .catch((error) => {
              if (error.status === 422){
                  setErrorMessage("");
  
                  if (error.response.data.errors.Description){
                    setErrorMessageDescription("* " + error.response.data.errors.Description);
                  } else {
                    setErrorMessageDescription("");
                  }
              }
              else if (error.status === 401){
                  setErrorMessage("*Unauthorized");
                  setErrorMessageDescription("");
              }
              else if (error.status === 403){
                setErrorMessage("*You can't edit this task");
                setErrorMessageDescription("");
              }
              console.error('Error fetching comments:', error);
            });
      };
  
      const handleDeleteTask = () => {
        const token = localStorage.getItem("accessToken");
          
        axios
          .delete(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`
                },
            }
          )
          .then((response) => {
            navigate(-1);
          })
          .catch((error) => {
            if (error.status === 401){
                alert("*Unauthorized");
            }
            else if (error.status === 403){
              alert("*You can't delete this task");
            }
            console.log(error)
          });
      };


      return (
        task ? (
            <>
          <div className="item-details-container">
            <h1>{task.title}</h1>
            <p className='description'><b>Description:</b> {task.description}</p>
            <p className='date'><b>Published:</b> {new Date(task.createdOn).toLocaleDateString()}</p>

            {(localStorage.getItem("Role") !== null && localStorage.getItem("Role").includes("Teacher")) && (
            <div className="buttons-container-task">
                    <button className='update-button-task' onClick={() => setIsUpdateOpen(true)}>Update</button>
                    <button className='delete-button-task' onClick={handleDeleteTask}>Delete</button>
            </div>
            )}

          </div>

          {isUpdateOpen && (
                    <div className="modal-overlay-task">
                        <div className="modal-content-task">
                            <h3>Edit Task</h3>

                            <button className="close-button-task" onClick={() => { setIsUpdateOpen(false); setErrorMessage(""); setErrorMessageDescription(""); setNewTaskDescription("");}}>X</button>

                            <p>Write a Description</p>
                            <textarea
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                rows={5}
                                cols={40}
                            />
                            <button className="confirm-button" onClick={handleUpdateTask}>Confirm</button>
                            <div className="error-message">{errorMessage}</div>
                            <div className="error-message">{errorMessageDescription}</div>
                        </div>
                    </div>
                )}


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