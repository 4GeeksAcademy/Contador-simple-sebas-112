import React, { useEffect, useRef, useState } from "react";

/**
 * SecondsCounter Pro
 * - Modo subir (stopwatch) y bajar (countdown)
 * - Objetivo con notificación (toast)
 * - Formato hh:mm:ss + barra de progreso
 * - Atajos: Space = start/pause, R = reset
 */

const format = (s) => {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

export default function SecondsCounter() {
  // core
  const [mode, setMode] = useState("up"); // 'up' | 'down'
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // objetivos y countdown
  const [target, setTarget] = useState(30);           // objetivo para avisar
  const [downStart, setDownStart] = useState(10);     // valor inicial para countdown

  // UI
  const [toast, setToast] = useState(null); // {type:'success'|'info'|'warning', msg:string} | null
  const intervalRef = useRef(null);

  // Timer engine
  useEffect(() => {
    clearInterval(intervalRef.current);

    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === "up") return prev + 1;
        // down
        if (prev <= 1) {
          // llegó a 0: detener y avisar
          setIsRunning(false);
          setToast({ type: "success", msg: "¡Cuenta regresiva terminada!" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  // Aviso de objetivo en modo 'up'
  useEffect(() => {
    if (mode === "up" && target > 0 && seconds === target) {
      setToast({ type: "info", msg: `¡Has alcanzado ${target} segundos!` });
    }
  }, [seconds, target, mode]);

  // Atajos de teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((r) => !r);
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // acciones
  const handleStartUp = () => {
    setMode("up");
    setIsRunning(true);
  };

  const handleStartDown = () => {
    const start = Number.isFinite(downStart) && downStart > 0 ? Math.floor(downStart) : 10;
    setMode("down");
    setSeconds(start);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(mode === "up" ? 0 : downStart || 0);
  };

  // progreso
  const progress =
    mode === "up"
      ? Math.max(0, Math.min(100, target > 0 ? (seconds / target) * 100 : 0))
      : Math.max(0, Math.min(100, downStart > 0 ? ((downStart - seconds) / downStart) * 100 : 0));

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h3 mb-0">
            <i className="fas fa-stopwatch me-2"></i>
            Contador <span className="badge bg-secondary ms-2 text-uppercase">{mode}</span>
          </h1>

          <div className="btn-group">
            {mode === "up" ? (
              <button className="btn btn-outline-light btn-sm" onClick={() => setMode("down")}>
                <i className="fa-solid fa-arrow-down-1-9 me-1"></i> Modo Down
              </button>
            ) : (
              <button className="btn btn-outline-light btn-sm" onClick={() => setMode("up")}>
                <i className="fa-solid fa-arrow-up-9-1 me-1"></i> Modo Up
              </button>
            )}
          </div>
        </div>

        {/* Display principal */}
        <div className="text-center p-4 rounded-4 timer-box mb-3">
          <div className="display-3 fw-bold">{format(seconds)}</div>
          <div className="text-secondary">hh:mm:ss</div>
        </div>

        {/* Progreso */}
        <div className="mb-4">
          <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
            <div
              className={`progress-bar ${mode === "up" ? "bg-info" : "bg-success"}`}
              style={{ width: `${progress}%`, transition: "width .4s ease" }}
            />
          </div>
          <div className="d-flex justify-content-between small text-secondary mt-1">
            <span>{mode === "up" ? "0s" : `${downStart}s`}</span>
            <span>{mode === "up" ? `${target || 0}s objetivo` : "0s"}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {isRunning ? (
            <button className="btn btn-warning" onClick={handlePause}>
              <i className="fa-solid fa-pause me-2"></i>Pausar
            </button>
          ) : (
            <>
              {mode === "up" ? (
                <button className="btn btn-success" onClick={handleStartUp}>
                  <i className="fa-solid fa-play me-2"></i>Iniciar
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleStartDown}>
                  <i className="fa-solid fa-play me-2"></i>Iniciar
                </button>
              )}
            </>
          )}

          <button className="btn btn-danger" onClick={handleReset}>
            <i className="fa-solid fa-rotate-left me-2"></i>Reiniciar
          </button>
        </div>

        {/* Configuración */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label equal">Objetivo para aviso (segundos) – modo UP</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fa-regular fa-bell"></i></span>
              <input
                type="number"
                min="1"
                className="form-control"
                value={target}
                onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value || "1")))}
              />
            </div>
            <div className="form-text">Te mostrará un aviso al llegar.</div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label equal">Inicio cuenta regresiva (segundos) – modo DOWN</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fa-solid fa-hourglass-half"></i></span>
              <input
                type="number"
                min="1"
                className="form-control"
                value={downStart}
                onChange={(e) => {
                  const v = Math.max(1, parseInt(e.target.value || "1"));
                  setDownStart(v);
                  if (mode === "down" && !isRunning) setSeconds(v);
                }}
              />
            </div>
            <div className="form-text">Cuando inicies en modo DOWN, parte desde este valor.</div>
          </div>
        </div>

        {/* Toast simple */}
        {toast && (
          <div
            className={`alert mt-4 ${toast.type === "success" ? "alert-success" : toast.type === "warning" ? "alert-warning" : "alert-info"}`}
            role="alert"
            onAnimationEnd={() => setToast(null)}
            style={{ animation: "fadeOut 2.4s forwards" }}
          >
            {toast.msg}
          </div>
        )}
      </div>

      {/* Animación para el toast */}
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 0; transform: translateY(-6px); }
          10% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; height: 0; padding-top: 0; padding-bottom: 0; margin: 0; }
        }
      `}</style>
    </div>
  );
}
