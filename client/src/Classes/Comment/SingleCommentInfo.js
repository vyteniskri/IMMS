import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Css styles/SingleComment.css';

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

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVhY2hlciIsImp0aSI6IjQxZTM5ODcwLTBjNjctNDVmYi1iODJkLWE3MDJhY2RjYjI0NSIsInN1YiI6IjA0OTNlMjY4LTA4ZmMtNDE0NC1iNGRiLWM5MzhkODFhMzgwMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJleHAiOjE3MzMzNTUxMDksImlzcyI6IlZ5dGVuaXMiLCJhdWQiOiJUcnVzdGVkQ2xpZW50In0.wDGF9N-g-agWVn-10LX9PkcLGTNfFnN4Mv1j-5vKEHc"; // Get token from localStorage
    
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
                setErrorMessage("*The message is incorect. \nWrite between 5 and 500 symbols.");
            }
            else if (error.status === 401){
                setErrorMessage("*Unautorized");
            }
           
            console.error('Error fetching subject:', error);
          });
    };

    const handleDeleteComment = () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVhY2hlciIsImp0aSI6ImM1ODJiNDIwLWUzYWUtNDExZi05YzFiLTNlMGY1MzcxMTJjMSIsInN1YiI6IjA0OTNlMjY4LTA4ZmMtNDE0NC1iNGRiLWM5MzhkODFhMzgwMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJleHAiOjE3MzMzNTI1MjUsImlzcyI6IlZ5dGVuaXMiLCJhdWQiOiJUcnVzdGVkQ2xpZW50In0.X4USgUFQHBKn7deLbQjvkztZY3qCmIvLryPXsBjrQNk";
        
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
                setErrorMessage("*Unautorized");
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
                                value={newCommentText}
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

            <div className="buttons-container">
                    <button className='update-button-comment' onClick={() => setIsUpdateOpen(true)}>Update</button>
                    <button className='delete-button-comment' onClick={handleDeleteComment}>Delete</button>
            </div>

            </>
        ) : (" ")
    );
    
};

export default SingleCommentInfo;