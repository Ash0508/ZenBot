import React, { useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChatNow = () => {
    if (isAuth) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="card p-4"
      style={{
        maxWidth: '850px',
        margin: 'auto',
        marginTop: '3rem',
        backgroundColor: '#121212', /* Deep black background */
        color: '#fff',
        borderRadius: '15px',
        padding: '3rem',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.6)', /* Subtle shadow */
        textAlign: 'center',
        border: '2px solid #00bcd4', /* Light blue border */
      }}
    >
      {isAuth && user ? (
        <h3
          className="gradientText text-center"
          style={{
            fontWeight: 'bold',
            fontSize: '2.5rem',
            color: '#ff4081', /* Pink color for authenticated user */
            textShadow: '0px 0px 10px rgba(255, 64, 129, 0.6)', /* Pink glow */
          }}
        >
          Hey, <strong>{user.username}</strong>!
        </h3>
      ) : (
        <h2
          className="gradientText text-center"
          style={{
            fontWeight: 'bold',
            fontSize: '2.5rem',
            color: '#ff4081', /* Pink color for Welcome, User */
            textShadow: '0px 0px 10px rgba(255, 64, 129, 0.6)', /* Pink glow */
          }}
        >
          Welcome, User!
        </h2>
      )}
      <div className="infoText mt-4 text-center" style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#ccc' }}>
        <p>
          <strong>ZenBot</strong> is a <span style={{ color: '#00bcd4', fontWeight: 'bold' }}>modern mental health assistant</span>, always available for you.
        </p>
        <p>
          Anytime you need to talk, <strong style={{ color: '#00bcd4' }}>ZenBot</strong> is here.
        </p>
      </div>

      <div className="text-center mt-5">
        <button
          className="btn btn-primary"
          style={{
            padding: '15px 60px',
            fontSize: '1.3rem',
            borderRadius: '30px',
            backgroundColor: '#00bcd4',
            color: '#000',
            fontWeight: 'bold',
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.5)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          onClick={handleChatNow}
        >
          Start Chat
        </button>
      </div>
      <footer className="text-center mt-5">
        <p style={{ color: '#00bcd4', fontSize: '1.2rem' }}>
          Designed by <span style={{ fontWeight: 'bold' }}>Ankush Singh.. ✨</span>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
