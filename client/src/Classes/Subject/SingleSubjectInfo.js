
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Css styles/ListAllItems.css';
import '../../Css styles/SingleSubject.css';
import AllTasksList from '../Task/AllTasksList';
import { getAccessToken } from "../Auth/NewAccessToken";

const SingleSubjectInfo = () => {
    const [subject, setSubject] = useState(null);
    const { subjectId } = useParams();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [newSubjectDescription, setNewSubjectDescription] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");

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

    const handleUpdateSubject = () => {
      const token = localStorage.getItem("accessToken");
    
        const updateSubject = { description: newSubjectDescription };
        axios
          .put(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}`,
            updateSubject,
            {
                headers: {
                  Authorization: `Bearer ${token}`
                },
            }
          )
          .then((response) => {
            setSubject(response.data);
            setErrorMessage("");
            setNewSubjectDescription("");
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
                getAccessToken(); /// tryes to get new access token

                setErrorMessage("*Please try again.");
                setErrorMessageDescription("");
            }
            else if (error.status === 403){
              setErrorMessage("*You can't edit this subject");
              setErrorMessageDescription("");
            }
            console.error('Error fetching comments:', error);
          });
    };

    const handleDeleteSubject = () => {
      const token = localStorage.getItem("accessToken");
        
      axios
        .delete(
          `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}`,
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
            getAccessToken(); /// tryes to get new access token

            alert("*Please try again.");
          }
          else if (error.status === 403){
            alert("*You can't delete this subject");
          }
        });
    };

    return (
        subject ? (
            <>

          <div className="item-details-container">
            <h1>{subject.title}</h1>
            <p className='description'><b>Description:</b> {subject.description}</p>
            <p className='date'><b>Published:</b> {new Date(subject.createdOn).toLocaleDateString()}</p>
              
            {(localStorage.getItem("Role") !== null && localStorage.getItem("Role").includes("Teacher")) && (
            <div className="buttons-container-subject">
              
                    <button className='update-button-subject' onClick={() => setIsUpdateOpen(true)}>Update</button>
                    <button className='delete-button-subject' onClick={handleDeleteSubject}>Delete</button>
            </div>
            )}

          </div>

          {isUpdateOpen && (
                    <div className="modal-overlay-subject">
                        <div className="modal-content-subject">
                            <h3>Edit Subject</h3>

                            <button className="close-button-subject" onClick={() => { setIsUpdateOpen(false); setErrorMessage(""); setErrorMessageDescription(""); setNewSubjectDescription("");}}>X</button>

                            <p>Write a Description</p>
                            <textarea
                                value={newSubjectDescription}
                                onChange={(e) => setNewSubjectDescription(e.target.value)}
                                rows={5}
                                cols={40}
                            />
                            <button className="confirm-button" onClick={handleUpdateSubject}>Confirm</button>
                            <div className="error-message">{errorMessage}</div>
                            <div className="error-message">{errorMessageDescription}</div>
                        </div>
                    </div>
                )}

          <AllTasksList subjectId={subjectId}/>


          </>
        ) : ( " " )
      );

};

export default SingleSubjectInfo;