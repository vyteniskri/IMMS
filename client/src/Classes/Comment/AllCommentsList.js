import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css styles/Comments.css';
import { useNavigate } from 'react-router-dom';

const AllCommentsList = ({ subjectId, taskId, onClose }) => {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const [newCommentText, setNewCommentText] = useState("Write your comment here...");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}/comments`)
          .then(response => {
            if (response.data.length > 0) {
                setComments(response.data);
            } else {
                setComments("no comments");
            }
          })
          .catch(error => {
            console.error('Error fetching comments:', error);
          });
    }, [subjectId, taskId]);

    const handleCommentClick = (commentId) => {
        navigate(`/AllSubjects/${subjectId}/AllTasks/${taskId}/AllComments/${commentId}`); 
    };

    const handleCreateComment = () => {

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVhY2hlciIsImp0aSI6IjQxZTM5ODcwLTBjNjctNDVmYi1iODJkLWE3MDJhY2RjYjI0NSIsInN1YiI6IjA0OTNlMjY4LTA4ZmMtNDE0NC1iNGRiLWM5MzhkODFhMzgwMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJleHAiOjE3MzMzNTUxMDksImlzcyI6IlZ5dGVuaXMiLCJhdWQiOiJUcnVzdGVkQ2xpZW50In0.wDGF9N-g-agWVn-10LX9PkcLGTNfFnN4Mv1j-5vKEHc"; // Get token from localStorage
    
        const updatedComment = { text: newCommentText };
        axios
          .post(
            `https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}/comments/`,
            updatedComment,
            {
                headers: {
                  Authorization: `Bearer ${token}`
                },
            }
          )
          .then((response) => {
            setComments((prevComments) => [...prevComments, response.data]);
            setErrorMessage("");
            setNewCommentText("");
          })
          .catch((error) => {
            if (error.status === 422){
                setErrorMessage("*The message is incorect. \nWrite between 5 and 500 symbols.");
            }
            else if (error.status === 401){
                setErrorMessage("*Unautorized");
            }
            console.error('Error fetching comments:', error);
          });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Comments</h2>
                <button className="close-button" onClick={onClose}>X</button>

                <div className="comments-list">
                    {comments === "no comments" ? (
                        <p>No comments yet.</p>
                        ) : (
                            comments.map((comment) => (
                                <div 
                                    key={comment.id} 
                                    className="comment-item"
                                    onClick={() => handleCommentClick(comment.id)}>
                                    <p>{comment.text}</p>
                                    <p className='comment-date'>{new Date(comment.createdOn).toLocaleString()}</p>
                                </div>
                             ))
                        )}
                </div>
                <h4>Leave a comment</h4>
                    <div className='new-comment-container'>

                        <textarea
                            className="new-comment-textarea"
                            value={newCommentText}
                            onFocus={(e) => { 
                                if (newCommentText === "Write your comment here...") {
                                    setNewCommentText("");
                                }
                            }}
                            onChange={(e) => setNewCommentText(e.target.value)}
                        />
                    {newCommentText !== "Write your comment here..." &&  (<button className='create-comment-button' onClick={handleCreateComment}>Comment</button>)}
                </div>
                <div className="error-message">{errorMessage}</div>
            </div>
        </div>
    );

};

export default AllCommentsList;