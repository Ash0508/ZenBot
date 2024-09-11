import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('forgotPassword');
  const [loading, setLoading] = useState(false);
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      login(data);
      navigate('/chat');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/forgotpassword`,
        { email },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      setMessage(data.message);
      setError(null);
      setModalStep('resetPassword');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to send OTP.'
      );
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/resetpassword`,
        {
          email,
          otp: otpString,
          newPassword,
        },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      setMessage(data.message);
      setError(null);
      setTimeout(() => {
        setShowModal(false);
        setModalStep('forgotPassword');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to reset password.'
      );
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep('forgotPassword');
    setMessage(null);
    setError(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center" style={{ fontWeight: 'bold', color: '#00bcd4' }}>Login</h2>
      {message && <div className="alert alert-success text-center">{message}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      
      {/* Login Form */}
      <form onSubmit={handleLogin} className="mx-auto shadow p-4 rounded" style={{ maxWidth: '500px', border: '2px solid #00bcd4', backgroundColor: '#121212' }}>
        <div className="form-group">
          <label style={{ fontWeight: 'bold', color: '#00bcd4' }}>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: '#00bcd4', borderWidth: '2px', backgroundColor: '#333', color: 'white' }}
          />
        </div>
        <br />
        <div className="form-group">
          <label style={{ fontWeight: 'bold', color: '#00bcd4' }}>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: '#00bcd4', borderWidth: '2px', backgroundColor: '#333', color: 'white' }}
          />
        </div>
        <div className="text-center mt-3">
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: '#00bcd4', color: 'black', fontWeight: 'bold' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff4081';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#00bcd4';
              e.target.style.color = 'black';
            }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
          </button>
        </div>
        <p className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setShowModal(true)}
            style={{ color: '#ff4081', fontWeight: 'bold' }}
          >
            Forgot Password?
          </button>
        </p>
      </form>

      {/* Forgot Password / Reset Password Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#00bcd4', fontWeight: 'bold' }}>
            {modalStep === 'forgotPassword' ? 'Forgot Password' : 'Reset Password'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#121212' }}>
          {message && <div className="alert alert-success text-center">{message}</div>}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {/* Forgot Password Form */}
          {modalStep === 'forgotPassword' && (
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#00bcd4' }}>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderColor: '#00bcd4', borderWidth: '2px', backgroundColor: '#333', color: 'white' }}
                />
              </div>
              <br />
              <div className="text-center">
                <button type="submit" className="btn" style={{ backgroundColor: '#00bcd4', borderColor: '#00bcd4', color: 'black', fontWeight: 'bold' }}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Reset Password Form */}
          {modalStep === 'resetPassword' && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#00bcd4' }}>OTP:</label>
                <div className="d-flex justify-content-between">
                  {otp.map((data, index) => (
                    <input
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="form-control text-center"
                      style={{ width: '3rem', marginRight: '0.5rem', borderColor: '#00bcd4', borderWidth: '2px', backgroundColor: '#333', color: 'white' }}
                    />
                  ))}
                </div>
              </div>
              <br />
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#00bcd4' }}>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  style={{ borderColor: '#00bcd4', borderWidth: '2px', backgroundColor: '#333', color: 'white' }}
                />
              </div>
              <br />
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#00bcd4' }}>Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  style={{ borderColor: '#00bcd4', borderWidth: '2px', backgroundColor: '#333', color: 'white' }}
                />
              </div>
              <br />
              <div className="text-center">
                <button type="submit" className="btn" style={{ backgroundColor: '#00bcd4', borderColor: '#00bcd4', color: 'black', fontWeight: 'bold' }}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} style={{ backgroundColor: 'black', color: '#00bcd4', borderColor: '#00bcd4' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;
