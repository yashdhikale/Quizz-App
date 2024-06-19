import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Quiz = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false); 

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10&difficulty=easy')
      .then(response => {
        const formattedQuestions = response.data.results.map(question => {
          const incorrectAnswers = question.incorrect_answers.map(answer => ({
            text: answer,
            isCorrect: false
          }));
          const correctAnswer = {
            text: question.correct_answer,
            isCorrect: true
          };
          const answers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
          return { ...question, answers, correctAnswer: question.correct_answer };
        });
        setQuestions(formattedQuestions);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch quiz questions. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleAnswerOptionClick = (isCorrect, selectedText) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setFeedbackMessage('Correct!');
    } else {
      const correctAnswer = questions[currentQuestionIndex].correctAnswer;
      setFeedbackMessage(`Incorrect! The correct answer is: ${correctAnswer}`);
    }
    setShowFeedback(true);
    setSelectedAnswer(selectedText);
  };

  const handleNextQuestionClick = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowScore(true);
      saveScoreHistory(score); // Save score to history when quiz ends
    }
  };

  const saveScoreHistory = (score) => {
    const savedHistory = JSON.parse(localStorage.getItem('scoreHistory')) || {};
    if (!savedHistory[user]) {
      savedHistory[user] = [];
    }
    savedHistory[user].push(score);
    localStorage.setItem('scoreHistory', JSON.stringify(savedHistory));
  };

  const loadScoreHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('scoreHistory')) || {};
    return savedHistory[user] || [];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="quiz-container">
      <div className="score-display">
        Score: {score}
      </div>
      {showScore ? (
        <div className="score-section">
          <h2>Thank you, {user}!</h2>
          <h2>You scored {score} out of {questions.length}</h2>
          <button className="quiz-button" onClick={() => window.location.reload()}>Restart Quiz</button>
          <button className="quiz-button" onClick={() => setShowHistory(true)}>Show History</button>
          <Modal
            isOpen={showHistory}
            onRequestClose={() => setShowHistory(false)}
            contentLabel="Score History"
            className="history-modal"
            overlayClassName="Overlay"
          >
            <h2>{user}'s Score History</h2>
            <ul>
              {loadScoreHistory().map((score, index) => (
                <li key={index}>Score {index + 1}: {score}</li>
              ))}
            </ul>
            <button onClick={() => setShowHistory(false)}>Close</button>
          </Modal>
        </div>
      ) : (
        <>
          {questions.length > 0 && (
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
              </div>
              <div className="question-text" dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
            </div>
          )}
          <div className="answer-section">
            {questions.length > 0 && questions[currentQuestionIndex].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(answer.isCorrect, answer.text)}
                className={selectedAnswer === answer.text ? 'selected' : ''}
                disabled={showFeedback}
              >
                <span dangerouslySetInnerHTML={{ __html: answer.text }} />
              </button>
            ))}
          </div>
          {showFeedback && (
            <div className="feedback-modal">
              <div className="feedback-content">
                <p>{feedbackMessage}</p>
                <button onClick={handleNextQuestionClick}>Next Question</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
