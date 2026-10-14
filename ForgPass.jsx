import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './ForgPass.css'
import { Link } from 'react-router-dom';

export default function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Введите корректный email адрес');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Не удалось отправить запрос. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Восстановление пароля</h2>
          <p className="subtitle">
            Введите ваш email, и мы отправим инструкции по сбросу пароля.
          </p>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label" htmlFor="recovery-email">
                Email
              </label>
            </div>
            <div className="input-wrapper focus-within-ring">
              <Mail className="input-icon" />
              <input
                id="recovery-email"
                type="email"
                placeholder="name@example.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить инструкции'}
          </button>

          <Link to="/login" className="back-link-btn">
            <ArrowLeft className="w-4 h-4" /> Вернуться к входу
          </Link>
        </form>
      ) : (
        <div className="success-state">
          <CheckCircle2 className="success-icon" />
          <h3>Письмо отправлено</h3>
          <p>
            Мы отправили ссылку для восстановления пароля на адрес{' '}
            <strong>{email}</strong>.
          </p>
          <Link to="/login" className="submit-btn">
            Вернуться к входу
          </Link>
        </div>
      )}
    </div>
  );
}
