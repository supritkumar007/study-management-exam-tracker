import React, { useState, useEffect } from 'react';
import styles from './StudyTimer.module.css';

const StudyTimer = ({ exam, onStop }) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [showExtensionPopup, setShowExtensionPopup] = useState(false);
    const [extendedMode, setExtendedMode] = useState(false);

    // Convert planned remaining to seconds
    const remainingSeconds = exam.remainingHours * 3600;

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    const newTime = prev + 1;
                    // Check if we hit the limit and haven't asked for extension yet
                    if (!extendedMode && !showExtensionPopup && newTime >= remainingSeconds && remainingSeconds > 0) {
                        setIsActive(false); // Pause
                        setShowExtensionPopup(true);
                    }
                    return newTime;
                });
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, remainingSeconds, showExtensionPopup, extendedMode]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStop = () => {
        onStop(seconds);
    };

    const handleExtend = () => {
        setExtendedMode(true);
        setShowExtensionPopup(false);
        setIsActive(true); // Resume
    };

    const handleFinish = () => {
        // User chose not to extend, so just stop strictly at the limit? 
        // Or just save whatever was done (which equals remaining).
        setShowExtensionPopup(false);
        handleStop();
    };

    return (
        <div className={styles.timerOverlay}>
            <div className={styles.timerCard}>
                <h3>Studying: {exam.subjectName} 📚</h3>
                <div className={styles.timeDisplay}>{formatTime(seconds)}</div>

                {!showExtensionPopup ? (
                    <button onClick={handleStop} className={styles.stopBtn}>
                        ⏹ Stop Session
                    </button>
                ) : (
                    <div className={styles.popup}>
                        <h4>🎉 Congratulations!</h4>
                        <p>You completed your planned study time!</p>
                        <p>Do you want to extend your study hours?</p>
                        <div className={styles.popupActions}>
                            <button onClick={handleExtend} className="btn-primary">Yes, Extend</button>
                            <button onClick={handleFinish} className={styles.noBtn}>No, Finish</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyTimer;
