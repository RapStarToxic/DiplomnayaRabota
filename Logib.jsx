import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight } from "lucide-react";
import './Login.css'

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPasssword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Пожалуйста, заполните все обязательные поля')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            if (email === 'admin@warehouse.ru' && password === 'admin123') {
                onLogin()
            } else {
                setError('Неверный адрес почты или пароль.')
            }
        }, 1200)
    }

    return (
        <div className="login-container font-sans antialiased">
            <div className="login-sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-logo">
                        <div className="logo-box">ИС</div>
                        <span className="logo-text">СкладУчет</span>
                    </div>

                    <div className="sidebar-footer">
                        <h2 className="sidebar-title">Контроль запасов и инвентаризация</h2>
                        <p className="sidebar-desc">Профессиональное решение для адресного хранения, вторизации цепочек поставок и онлайн-учета остатков товаров</p>
                    </div>
                </div>
            </div>

            <div className="login-main">
                <div className="login-card animate-fade-in">
                    <div className="login-header">
                        <h1 className="login-title">Войти в систему</h1>
                        <p className="login-subtitle">Введите ваши данные для доступа к складу</p>
                    </div>

                    {error && (
                        <div className="login-error-box">
                            <ShieldAlert className="w-5 h-5 shrink-0"></ShieldAlert>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Рабочий Email</label>
                            <div className="input-wrapper focus-within-ring">
                                <Mail className="input-icon"></Mail>
                                <input type="email" placeholder="name@company.com" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label className="form-label">Пароль</label>
                                <a href="#forgot" className="form-link">Забыли пароль?</a>
                            </div>
                            <div className="input-wrapper focus-within-ring">
                                <Lock className="input-icon"></Lock>
                                <input type={showPassword ? 'text' : 'password'} placeholder="---------" className="form-input" value={password} onChange={(e) => setPasssword(e.target.value)} disabled={isLoading} />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Скрыть пароль" : "Показать пароль"}>{showPassword ? <EyeOff className="w-4 h-4"></EyeOff>: <Eye className="w-4 h-4"></Eye>}</button>
                            </div>
                        </div>
                        <button type="submit" className={`login-submit-btn ${isLoading ? 'btn-loading' : ''}`} disabled={isLoading}>{isLoading ? (
                            <div className="spinner"></div>
                        ):(
                            <>
                            <span>Войти в учетную запись</span>
                            <ArrowRight className="w-4 h-4 btn-arrow"></ArrowRight>
                            </>
                        )}</button>
                    </form>

                    <div className="login-form-footer">
                        <p>Нужен доступ? Обратитесь к <a href="#support" className="form-link"> системному администратору</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
