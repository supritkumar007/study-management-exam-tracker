import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        studentId: '', // New field
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, studentId, email, password, confirmPassword } = formData;

    const validatePassword = (pwd) => {
        return {
            length: pwd.length >= 8,
            upper: /[A-Z]/.test(pwd),
            lower: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        };
    };

    const pwdValidation = validatePassword(password);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const isPwdValid = Object.values(pwdValidation).every(Boolean);
        if (!isPwdValid) {
            toast.error("Password does not meet requirements");
            return;
        }

        try {
            await register({ name, studentId, email, password });
            toast.success('Registration Successful! 🎉');
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration Error:', err.response);
            const errorMsg = err.response?.data?.msg || 'Registration Failed';
            toast.error(errorMsg);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={`card ${styles.authCard}`}>
                <h2 className={styles.title}>Student Registration 📝</h2>
                <form onSubmit={onSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Student ID</label>
                        <input
                            type="text"
                            name="studentId"
                            value={studentId}
                            onChange={onChange}
                            required
                            placeholder="e.g. S12345"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            placeholder="Aakash"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            placeholder="student@example.com"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {password && (
                            <div className={styles.passwordReqs}>
                                <small className={pwdValidation.length ? styles.valid : styles.invalid}>✓ 8+ chars</small><br />
                                <small className={pwdValidation.upper ? styles.valid : styles.invalid}>✓ 1 Uppercase</small><br />
                                <small className={pwdValidation.lower ? styles.valid : styles.invalid}>✓ 1 Lowercase</small><br />
                                <small className={pwdValidation.number ? styles.valid : styles.invalid}>✓ 1 Number</small><br />
                                <small className={pwdValidation.special ? styles.valid : styles.invalid}>✓ 1 Special Char</small>
                            </div>
                        )}
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Confirm Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <span className="error-msg">Passwords do not match</span>
                        )}
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Register
                    </button>
                </form>
                <p className={styles.footerText}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
