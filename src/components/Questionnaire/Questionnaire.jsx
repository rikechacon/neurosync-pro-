import { useState, useEffect } from 'react';
import { getOrderedQuestions, validateAnswers, getQuestionProgress } from './questions';
import { mapAnswersToRoutine } from '../../utils/frequencyMapper';
import './Questionnaire.css';

export default function Questionnaire({ onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const questions = getOrderedQuestions();
  const currentQuestion = questions[currentStep];
  const progress = getQuestionProgress(currentStep, questions.length);

  // Manejar respuesta de tipo escala (1-10)
  const handleScaleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  // Manejar respuesta de opción única
  const handleSingleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
    
    // Avanzar automáticamente con pequeña animación
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 250);
  };

  // Navegación manual entre preguntas
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Enviar respuestas y generar rutina
  const handleSubmit = () => {
    const validation = validateAnswers(answers);
    
    if (!validation.valid) {
      setErrors({ submit: validation.message });
      // Scroll al error
      const errorElement = document.querySelector('.error-message');
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Generar rutina personalizada
    const routine = mapAnswersToRoutine(answers);
    
    // Callback al componente padre
    onComplete?.(routine);
  };

  // Renderizar input según tipo de pregunta
  const renderQuestionInput = (question) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="scale-input-container">
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={answers[question.id] || question.min}
              onChange={(e) => handleScaleAnswer(question.id, e.target.value)}
              className="scale-slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((answers[question.id] || question.min) - question.min) / (question.max - question.min) * 100}%, rgba(255,255,255,0.1) ${((answers[question.id] || question.min) - question.min) / (question.max - question.min) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="scale-labels">
              <span className="scale-min">{question.labels[question.min]}</span>
              <span className="scale-value">{answers[question.id] || question.min}</span>
              <span className="scale-max">{question.labels[question.max]}</span>
            </div>
          </div>
        );

      case 'single':
        return (
          <div className="options-grid">
            {question.options.map(option => (
              <button
                key={option.value}
                className={`option-card ${answers[question.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleSingleAnswer(question.id, option.value)}
                type="button"
              >
                <div className="option-icon">{option.label.split(' ')[0]}</div>
                <div className="option-content">
                  <span className="option-label">{option.label.replace(/^[^\s]+\s/, '')}</span>
                  {option.description && (
                    <span className="option-description">{option.description}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="questionnaire-wrapper">
      {/* Header con progreso */}
      <div className="questionnaire-header">
        <button className="back-btn" onClick={onBack} type="button">
          ← Volver
        </button>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}% Completado</span>
        </div>
        <div className="step-counter">
          Pregunta {currentStep + 1} de {questions.length}
        </div>
      </div>

      {/* Tarjeta de pregunta */}
      <div className={`question-card ${isAnimating ? 'animating' : ''}`}>
        <div className="question-content">
          <h2 className="question-text">{currentQuestion.text}</h2>
          
          {currentQuestion.hint && (
            <p className="question-hint">💡 {currentQuestion.hint}</p>
          )}
          
          <div className="question-input">
            {renderQuestionInput(currentQuestion)}
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {errors.submit && (
        <div className="error-message" role="alert">
          ⚠️ {errors.submit}
        </div>
      )}
      {errors[currentQuestion?.id] && (
        <div className="error-message" role="alert">
          ⚠️ {errors[currentQuestion.id]}
        </div>
      )}

      {/* Navegación */}
      <div className="navigation-buttons">
        {currentStep > 0 && (
          <button 
            className="nav-btn secondary" 
            onClick={handlePrevious}
            type="button"
          >
            ← Anterior
          </button>
        )}
        
        {currentStep < questions.length - 1 ? (
          <button 
            className="nav-btn primary" 
            onClick={handleNext}
            disabled={answers[currentQuestion?.id] === undefined}
            type="button"
          >
            Siguiente →
          </button>
        ) : (
          <button 
            className="nav-btn submit" 
            onClick={handleSubmit}
            type="button"
          >
            🎧 Generar Mi Rutina Personalizada
          </button>
        )}
      </div>

      {/* Info de privacidad */}
      <p className="privacy-note">
        Tus respuestas se procesan localmente. No se comparten con terceros.
      </p>
    </div>
  );
}
