import { useState, useEffect } from 'react';
import './Questionnaire.css';

const QUESTIONS = [
  {
    id: 'goal',
    question: '¿Cuál es tu objetivo principal?',
    type: 'single',
    options: [
      { value: 'relax', label: 'Relajarme y reducir estrés', icon: '🧘' },
      { value: 'focus', label: 'Mejorar concentración', icon: '🎯' },
      { value: 'sleep', label: 'Dormir mejor', icon: '😴' },
      { value: 'energy', label: 'Tener más energía', icon: '⚡' },
      { value: 'meditation', label: 'Meditar más profundo', icon: '🧘' },
      { value: 'creativity', label: 'Aumentar creatividad', icon: '🎨' }
    ]
  },
  {
    id: 'mood',
    question: '¿Cómo te sientes ahora mismo?',
    type: 'single',
    options: [
      { value: 'stressed', label: 'Estresado/a', icon: '😰' },
      { value: 'tired', label: 'Cansado/a', icon: '😴' },
      { value: 'anxious', label: 'Ansioso/a', icon: '😟' },
      { value: 'neutral', label: 'Normal', icon: '😐' },
      { value: 'good', label: 'Bien', icon: '🙂' },
      { value: 'great', label: 'Excelente', icon: '🤩' }
    ]
  },
  {
    id: 'time',
    question: '¿Cuánto tiempo tienes?',
    type: 'single',
    options: [
      { value: '10', label: '10 minutos (rápido)', icon: '' },
      { value: '20', label: '20 minutos (estándar)', icon: '⏱️' },
      { value: '30', label: '30 minutos (completo)', icon: '🕐' },
      { value: '45', label: '45 minutos (profundo)', icon: '🕑' },
      { value: '60', label: '60 minutos (inmersivo)', icon: '🕒' }
    ]
  },
  {
    id: 'intensity',
    question: '¿Qué intensidad prefieres?',
    type: 'single',
    options: [
      { value: 'gentle', label: 'Suave y relajante', icon: '🌸' },
      { value: 'moderate', label: 'Moderada', icon: '🌊' },
      { value: 'strong', label: 'Intensa', icon: '🌊' },
      { value: 'extreme', label: 'Máxima potencia', icon: '🌊🌊' }
    ]
  }
];

export default function Questionnaire({ onComplete, onBack, selectedCategory }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Si hay categoría pre-seleccionada, usarla como primera respuesta
  useEffect(() => {
    if (selectedCategory) {
      setAnswers({ goal: selectedCategory.id });
      setCurrentQuestion(1); // Saltar primera pregunta
    }
  }, [selectedCategory]);

  const handleAnswer = (value) => {
    setIsTransitioning(true);
    
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: value };
    setAnswers(newAnswers);

    // Pequeña delay para transición suave
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Últimas preguntas → completar
        handleComplete(newAnswers);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleComplete = (finalAnswers) => {
    const routine = {
      answers: finalAnswers,
      name: `Sesión ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString()
    };
    onComplete(routine);
  };

  const currentQ = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="questionnaire-container">
      <button className="back-button" onClick={onBack}>← Volver</button>
      
      {/* BARRA DE PROGRESO */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className={`question-card ${isTransitioning ? 'fade-out' : ''}`}>
        <h2 className="question-title">{currentQ.question}</h2>
        
        <div className="options-grid">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              className="option-button"
              onClick={() => handleAnswer(option.value)}
            >
              <span className="option-icon">{option.icon}</span>
              <span className="option-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="question-hint">
        Pregunta {currentQuestion + 1} de {QUESTIONS.length}
      </p>
    </div>
  );
}
