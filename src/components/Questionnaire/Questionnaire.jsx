import { useState } from 'react';
import { questions, frequencyMapping, natureSounds } from './questions';
import './Questionnaire.css';

export default function Questionnaire({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 200);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calcular perfil basado en respuestas
    const goal = answers.goal || 'relax';
    const protocol = frequencyMapping[goal];
    
    const routine = {
      carrierFreq: protocol.carrier,
      beatFreq: protocol.beat,
      band: protocol.band,
      natureSound: natureSounds[answers.nature_preference] || null,
      duration: calculateDuration(answers),
      timestamp: new Date().toISOString(),
      answers
    };

    // Guardar en backend (opcional)
    try {
      await fetch('https://tu-backend.onrender.com/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routine)
      });
    } catch (error) {
      console.warn('Error guardando rutina:', error);
      // Continuar aunque falle el backend (funciona offline)
    }

    setIsSubmitting(false);
    onComplete(routine);
  };

  const calculateDuration = (answers) => {
    // Duración basada en nivel de estrés
    const stressLevel = answers.stress_frequency || 3;
    if (stressLevel >= 4) return 1800; // 30 min
    if (stressLevel >= 3) return 900;  // 15 min
    return 300; // 5 min
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="questionnaire-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="question-card">
        <h2>{question.text}</h2>
        
        <div className="options-grid">
          {question.options.map(option => (
            <button
              key={option.value}
              className="option-btn"
              onClick={() => handleAnswer(question.id, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion === questions.length - 1 && (
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(answers).length < questions.length}
        >
          {isSubmitting ? 'Generando rutina...' : 'Comenzar sesión'}
        </button>
      )}
    </div>
  );
}
