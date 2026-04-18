import { useState, useEffect } from 'react';
import './Questionnaire.css';

// FRECUENCIAS SOLFEGGIO PARA SANACIÓN
const SOLFEGGIO_OPTIONS = [
  { value: 'solfeggio396', label: '396 Hz - Liberar Miedos', icon: '🔓', desc: 'Libera culpa y traumas' },
  { value: 'solfeggio417', label: '417 Hz - Cambio', icon: '🔄', desc: 'Transforma patrones' },
  { value: 'solfeggio528', label: '528 Hz - Reparación', icon: '💚', desc: 'Sanación y milagros' },
  { value: 'solfeggio639', label: '639 Hz - Conexión', icon: '💞', desc: 'Relaciones armoniosas' },
  { value: 'solfeggio741', label: '741 Hz - Expresión', icon: '🗣️', desc: 'Claridad mental' },
  { value: 'solfeggio852', label: '852 Hz - Intuición', icon: '👁️', desc: 'Despierta intuición' },
  { value: 'solfeggio963', label: '963 Hz - Divino', icon: '✨', desc: 'Conexión divina' },
  { value: 'schumann', label: '7.83 Hz - Tierra', icon: '🌍', desc: 'Resonancia Schumann' }
];

// PREGUNTAS NORMALES (no sanación)
const REGULAR_QUESTIONS = [
  {
    id: 'goal',
    question: '¿Cuál es tu objetivo principal?',
    type: 'single',
    options: [
      { value: 'relax', label: 'Relajarme', icon: '🧘' },
      { value: 'focus', label: 'Concentrarme', icon: '🎯' },
      { value: 'sleep', label: 'Dormir mejor', icon: '😴' },
      { value: 'energy', label: 'Más energía', icon: '⚡' },
      { value: 'meditation', label: 'Meditar', icon: '🧘' },
      { value: 'creativity', label: 'Ser creativo', icon: '🎨' }
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
      { value: '10', label: '10 min (rápido)', icon: '⏱️' },
      { value: '20', label: '20 min (estándar)', icon: '⏱️' },
      { value: '30', label: '30 min (completo)', icon: '🕐' },
      { value: '45', label: '45 min (profundo)', icon: '🕑' },
      { value: '60', label: '60 min (inmersivo)', icon: '🕒' }
    ]
  },
  {
    id: 'intensity',
    question: '¿Qué intensidad prefieres?',
    type: 'single',
    options: [
      { value: 'gentle', label: 'Suave', icon: '🌸', desc: 'Relajación suave' },
      { value: 'moderate', label: 'Moderada', icon: '🌊', desc: 'Equilibrada' },
      { value: 'strong', label: 'Intensa', icon: '🌊', desc: 'Mayor potencia' },
      { value: 'extreme', label: 'Máxima', icon: '🌊🌊', desc: 'Máxima frecuencia' }
    ]
  }
];

export default function Questionnaire({ onComplete, onBack, selectedCategory }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSolfeggio, setShowSolfeggio] = useState(false);

  // Si es sanación, mostrar primero Solfeggio
  useEffect(() => {
    if (selectedCategory?.id === 'healing') {
      setShowSolfeggio(true);
    }
  }, [selectedCategory]);

  const handleAnswer = (value) => {
    setIsTransitioning(true);
    
    const newAnswers = { ...answers, [getCurrentQuestion().id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < getCurrentQuestions().length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleComplete(newAnswers);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleSolfeggioSelect = (value) => {
    // Seleccionar frecuencia Solfeggio y saltar a siguiente pregunta
    const newAnswers = { ...answers, goal: value };
    setAnswers(newAnswers);
    setShowSolfeggio(false);
    setCurrentQuestion(0); // Empezar preguntas normales desde la 0
  };

  const handleComplete = (finalAnswers) => {
    const routine = {
      answers: finalAnswers,
      name: `Sesión ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString()
    };
    onComplete(routine);
  };

  const getCurrentQuestions = () => {
    if (selectedCategory?.id === 'healing' && showSolfeggio) {
      return []; // Mostrar Solfeggio en lugar de preguntas
    }
    return REGULAR_QUESTIONS;
  };

  const getCurrentQuestion = () => {
    const questions = getCurrentQuestions();
    return questions[currentQuestion];
  };

  const totalQuestions = getCurrentQuestions().length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  // MOSTRAR SOLFEGGIO SI ES SANACIÓN
  if (selectedCategory?.id === 'healing' && showSolfeggio) {
    return (
      <div className="questionnaire-container">
        <button className="back-button" onClick={onBack}>← Volver</button>
        
        <div className="solfeggio-selection">
          <h2 className="question-title">🌸 Selecciona tu Frecuencia de Sanación</h2>
          <p className="solfeggio-intro">
            Las frecuencias Solfeggio son tonos sagrados usados durante siglos para sanación profunda
          </p>
          
          <div className="solfeggio-grid">
            {SOLFEGGIO_OPTIONS.map((option) => (
              <button
                key={option.value}
                className="solfeggio-card"
                onClick={() => handleSolfeggioSelect(option.value)}
              >
                <span className="solfeggio-icon">{option.icon}</span>
                <span className="solfeggio-label">{option.label}</span>
                <span className="solfeggio-desc">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = getCurrentQuestion();

  return (
    <div className="questionnaire-container">
      <button className="back-button" onClick={onBack}>← Volver</button>
      
      {totalQuestions > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className={`question-card ${isTransitioning ? 'fade-out' : ''}`}>
        <h2 className="question-title">{currentQ?.question}</h2>
        
        <div className="options-grid">
          {currentQ?.options.map((option) => (
            <button
              key={option.value}
              className="option-button"
              onClick={() => handleAnswer(option.value)}
            >
              <span className="option-icon">{option.icon}</span>
              <span className="option-label">{option.label}</span>
              {option.desc && <span className="option-desc">{option.desc}</span>}
            </button>
          ))}
        </div>
      </div>

      {totalQuestions > 0 && (
        <p className="question-hint">
          Pregunta {currentQuestion + 1} de {totalQuestions}
        </p>
      )}
    </div>
  );
}
