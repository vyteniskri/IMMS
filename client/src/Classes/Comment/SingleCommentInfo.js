import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Css styles/SingleComment.css';
import { getAccessToken } from "../Auth/NewAccessToken";

const SingleCommentInfo = () => {
    const { subjectId, taskId, commentId } = useParams();
    const [comment, setComment] = useState(null);
    const [newCommentText, setNewCommentText] = useState("");
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}/comments/${commentId}`)
          .then(response => {
            setComment(response.data);
          })
          .catch(error => {
            console.error('Error fetching subject:', error);
          });
  
      }, [subjectId, taskId, commentId]);


    const handleUpdateComment = () => {

      const token = localStorage.getItem("accessToken");
    
        const updatedComment = { text: newCommentText };
        axios
          .put(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}/comments/${commentId}`,
            updatedComment,
            {
                headers: {
                  Authorization: `Bearer ${token}`
                },
            }
          )
          .then((response) => {
            setComment(response.data); 
            setIsUpdateOpen(false);
            setErrorMessage("");
          })
          .catch((error) => {
            if (error.status === 422){
                setErrorMessage(error.response.data.errors.Text);
            }
            else if (error.status === 401){
                getAccessToken();
                setErrorMessage("*Please try again.");
            }
            else if (error.status === 403){
              setErrorMessage("*You can't edit this comment")
            }
           
            console.error('Error fetching subject:', error);
          });
    };

    const handleDeleteComment = () => {
      const token = localStorage.getItem("accessToken");
        
        axios
          .delete(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}/comments/${commentId}`,
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
              getAccessToken();
              alert("*Please try again.");
            }
            else if (error.status === 403){
              alert("*You can't delete this comment");
            }
          });
    };
      

      return (
        comment ? (
            <>
            <div className="single-comment-container">
                <h1>{comment.text}</h1>
                <p><b>Published:</b> {new Date(comment.createdOn).toLocaleString()}</p>


                {isUpdateOpen && (
                    <div className="modal-overlay-comment">
                        <div className="modal-content-comment">
                            <h3>Edit Comment</h3>

                            <button className="close-button-comment" onClick={() => { setIsUpdateOpen(false); setErrorMessage(""); setNewCommentText(""); }}>X</button>

                            <textarea
                                value={comment.text}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                rows={5}
                                cols={40}
                            />
                            <button className="confirm-button" onClick={handleUpdateComment}>Update Comment</button>
                            <div className="error-message">{errorMessage}</div>
                        </div>
                    </div>
                )}
               

            </div>
              
            {localStorage.getItem("Role") !== null  && (
            <div className="buttons-container">
                    <button className='update-button-comment' onClick={() => setIsUpdateOpen(true)}>Update</button>
                    <button className='delete-button-comment' onClick={handleDeleteComment}>Delete</button>
            </div>
            )}

            </>
        ) : (" ")
    );
    
};

export default SingleCommentInfo;