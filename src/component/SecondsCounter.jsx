import React, { useState, useEffect, useRef } from "react";

function SecondsCounter() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [target, setTarget] = useState(10);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    useEffect(() => {
        if (seconds === target) {
            alert(`¡Has alcanzado ${target} segundos!`);
        }
    }, [seconds, target]);

    const handleRestart = () => {
        setSeconds(0);
        setIsRunning(true);
    };

    const handleCountdown = () => {
        setIsRunning(false);
        const countdown = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    alert("¡Cuenta regresiva terminada!");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="container text-center mt-5">
            <div className="display-4 mb-4">
                <i className="fas fa-clock me-3"></i>
                {seconds} segundos
            </div>
            <div className="mb-3">
                <button className="btn btn-success me-2" onClick={() => setIsRunning(true)}>Reanudar</button>
                <button className="btn btn-warning me-2" onClick={() => setIsRunning(false)}>Pausar</button>
                <button className="btn btn-danger me-2" onClick={handleRestart}>Reiniciar</button>
                <button className="btn btn-primary" onClick={handleCountdown}>Cuenta regresiva</button>
            </div>
            <div>
                <input
                    type="number"
                    className="form-control w-25 d-inline"
                    value={target}
                    onChange={e => setTarget(parseInt(e.target.value))}
                />
                <span className="ms-2">← Tiempo para alerta (segundos)</span>
            </div>
        </div>
    );
}

export default SecondsCounter;
