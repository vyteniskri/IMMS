import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css styles/Comments.css';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from "../Auth/NewAccessToken";

const AllCommentsList = ({ subjectId, taskId, onClose }) => {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const [newCommentText, setNewCommentText] = useState("Write your comment here...");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://goldfish-app-ebu3p.ondigitalocean.app/api/subjects/${subjectId}/tasks/${taskId}/comments`)
          .then(response => {
            if (response.data.length > 0) {
                setComments(response.data);
                setLoading(false);
            } else {
                setComments([]);
                setLoading(false);
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

        const token = localStorage.getItem("accessToken");
    
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
                setErrorMessage(error.response.data.errors.Text);
            }
            else if (error.status === 401){
                getAccessToken();
                setErrorMessage("*Please try again.");
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
                    {comments.length === 0 && !loading ? (
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