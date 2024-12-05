import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css styles/ListAllItems.css';
import '../../Css styles/SingleSubject.css';
import { useNavigate } from 'react-router-dom';

const AllSubjectsList = () => {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const [IsCreateOpen, setIsCreateOpen] = useState(false);
    const [newSubjectTitle, setNewSubjectTitle] = useState("");
    const [newSubjectDescription, setNewSubjectDescription] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageTitle, setErrorMessageTitle] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");

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

    const handleCreateNewSubject = () => {
      const token = localStorage.getItem("accessToken"); // Get token from localStorage
    
        const createSubject = { title: newSubjectTitle, description: newSubjectDescription };
        axios
          .post(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/`,
            createSubject,
            {
                headers: {
                  Authorization: `Bearer ${token}`
                },
            }
          )
          .then((response) => {
            setSubjects((prevSubject) => [...prevSubject, response.data]);
            setErrorMessage("");
            setNewSubjectTitle("");
            setNewSubjectDescription("");
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
            } else if (error.status === 403){
              setErrorMessage("*Only a teacher can create new subjects");
              setErrorMessageTitle("");
              setErrorMessageDescription("");
            }
            console.error('Error fetching comments:', error);
          });
    };
  
    return (
      <>
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
            
        {IsCreateOpen && (
                    <div className="modal-overlay-subject">
                        <div className="modal-content-subject">
                            <h3>Create new Subject</h3>
                            <button className="close-button-subject" onClick={() => { setIsCreateOpen(false); setErrorMessage(""); setErrorMessageTitle(""); setErrorMessageDescription(""); setNewSubjectTitle(""); setNewSubjectDescription("");}}>X</button>

                            <p>Write a Title</p>
                            <input
                                className='input-conteiner'
                                value={newSubjectTitle}
                                onChange={(e) => setNewSubjectTitle(e.target.value)}
                                rows={5}
                                cols={40}
                            />

                            <p>Write a Description</p>
                            <textarea
                                value={newSubjectDescription}
                                onChange={(e) => setNewSubjectDescription(e.target.value)}
                                rows={5}
                                cols={40}
                            />
                            
                              <button className="confirm-button-subject" onClick={handleCreateNewSubject}>Confirm</button>
                            <div className="error-message">{errorMessage}</div>
                            <div className="error-message">{errorMessageTitle}</div>
                            <div className="error-message">{errorMessageDescription}</div>
                        </div>
                    </div>
          )}


          {(localStorage.getItem("Role") !== null && localStorage.getItem("Role").includes("Teacher")) && (
            <button className='create-subject-button' onClick={() => setIsCreateOpen(true)}>Create Subject</button>

          )}
      </>
      );
};

export default AllSubjectsList;
