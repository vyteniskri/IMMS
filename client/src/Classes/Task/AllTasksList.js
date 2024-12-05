
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css styles/ListAllItems.css';
import '../../Css styles/SingleTask.css';

const AllTasksList = ({subjectId}) => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const [IsCreateOpen, setIsCreateOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageTitle, setErrorMessageTitle] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");

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

    const handleCreateNewTask= () => {
      const token = localStorage.getItem("accessToken");
    
        const createSubject = { title: newTaskTitle, description: newTaskDescription };
        axios
          .post(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks`,
            createSubject,
            {
                headers: {
                  Authorization: `Bearer ${token}`
                },
            }
          )
          .then((response) => {
            setTasks((prevTask) => [...prevTask, response.data]);
            setErrorMessage("");
            setNewTaskTitle("");
            setNewTaskDescription("");
            setErrorMessageTitle("");
            setErrorMessageDescription("");
            setIsCreateOpen(false);
          })
          .catch((error) => {
            if (error.status === 422){
                setErrorMessage("");
                if (error.response.data.errors.Title){
                  setErrorMessageTitle("* " + error.response.data.errors.Title);
                } else {
                  setErrorMessageTitle("");
                }

                if (error.response.data.errors.Description){
                  setErrorMessageDescription("* " + error.response.data.errors.Description);
                } else {
                  setErrorMessageDescription("");
                }
            }
            else if (error.status === 401){
                setErrorMessage("*Unauthorized");
                setErrorMessageTitle("");
                setErrorMessageDescription("");
            } 
            else if (error.status === 403){
              setErrorMessage("*Only a teacher can create new tasks");
              setErrorMessageTitle("");
              setErrorMessageDescription("");
            }
            console.error('Error fetching comments:', error);
          });
    };

    return (
      <>
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

            {IsCreateOpen && (
                    <div className="modal-overlay-task">
                        <div className="modal-content-task">
                            <h3>Create new Task</h3>
                            <button className="close-button-task" onClick={() => { setIsCreateOpen(false); setErrorMessage(""); setErrorMessageTitle(""); setErrorMessageDescription(""); setNewTaskTitle(""); setNewTaskDescription("");}}>X</button>

                            <p>Write a Title</p>
                            <input
                                className='input-conteiner'
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                rows={5}
                                cols={40}
                            />

                            <p>Write a Description</p>
                            <textarea
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                rows={5}
                                cols={40}
                            />
                            
                              <button className="confirm-button-task" onClick={handleCreateNewTask}>Confirm</button>
                            <div className="error-message">{errorMessage}</div>
                            <div className="error-message">{errorMessageTitle}</div>
                            <div className="error-message">{errorMessageDescription}</div>
                        </div>
                    </div>
          )}

        {(localStorage.getItem("Role") !== null && localStorage.getItem("Role").includes("Teacher")) && (
          <button className='create-task-button' onClick={() => setIsCreateOpen(true)}>Create Task</button>
        )}

      </>
    );
};

export default AllTasksList;