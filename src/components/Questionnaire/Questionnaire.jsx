import { useState, useMemo } from 'react';
import { getOrderedQuestions, validateAnswers, getQuestionProgress } from './questions';
import { mapAnswersToRoutine } from '../../utils/frequencyMapper';
import './Questionnaire.css';

export default function Questionnaire({ onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  // Obtener todas las preguntas base
  const allQuestions = useMemo(() => getOrderedQuestions(), []);

  // Calcular preguntas visibles basadas en respuestas
  const visibleQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      if (q.conditional?.showIf) {
        const { goal, value } = q.conditional.showIf;
        return answers[goal] === value;
      }
      return true;
    });
  }, [allQuestions, answers]);

  // Estado para índice actual
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Ajustar índice si excede el número de preguntas
  const safeIndex = Math.min(currentQuestionIndex, Math.max(0, visibleQuestions.length - 1));
  const currentQuestion = visibleQuestions[safeIndex];

  // Calcular progreso
  const progress = visibleQuestions.length > 0 
    ? getQuestionProgress(safeIndex, visibleQuestions.length)
    : 0;

  // Manejar respuesta de tipo escala
  const handleScaleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  // Manejar respuesta de opción única
  const handleSingleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  // Navegación manual
  const handleNext = () => {
    if (safeIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (safeIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Enviar respuestas
  const handleSubmit = () => {
    const validation = validateAnswers(answers);
    
    if (!validation.valid) {
      setErrors({ submit: validation.message });
      return;
    }

    const routine = mapAnswersToRoutine(answers);
    onComplete?.(routine);
  };

  // Renderizar input según tipo
  const renderQuestionInput = (question) => {
    if (!question) return null;

    if (question.type === 'scale') {
      const value = answers[question.id] ?? question.min;
      const percentage = ((value - question.min) / (question.max - question.min)) * 100;
      
      return (
        <div className="scale-input-container">
          <input
            type="range"
            min={question.min}
            max={question.max}
            value={value}
            onChange={(e) => handleScaleAnswer(question.id, e.target.value)}
            className="scale-slider"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="scale-labels">
            <span className="scale-min">{question.labels[question.min]}</span>
            <span className="scale-value">{value}</span>
            <span className="scale-max">{question.labels[question.max]}</span>
          </div>
        </div>
      );
    }

    if (question.type === 'single') {
      const optionsByCategory = question.options.reduce((acc, opt) => {
        const cat = opt.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(opt);
        return acc;
      }, {});

      return (
        <div className="options-container">
          {Object.entries(optionsByCategory).map(([category, options]) => (
            <div key={category} className="options-category">
              {category !== 'general' && (
                <h4 className="category-label">{getCategoryLabel(category)}</h4>
              )}
              <div className="options-grid">
                {options.map(option => {
                  const isSelected = answers[question.id] === option.value;
                  const isFeatured = option.featured;
                  
                  return (
                    <button
                      key={option.value}
                      className={`option-card ${isSelected ? 'selected' : ''} ${isFeatured ? 'featured' : ''}`}
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
                      {isFeatured && <span className="featured-badge">⭐</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      neurological: '🧠 Neurológico / Cognitivo',
      solfeggio: '🎵 Frecuencias Solfeggio',
      pain: '💊 Dolor e Inflamación',
      immune: '🛡️ Sistema Inmunológico',
      digestive: '🍃 Digestivo',
      circulatory: '❤️ Circulatorio',
      respiratory: '🫁 Respiratorio',
      skin: '✨ Piel y Regeneración',
      sleep: '😴 Sueño Profundo',
      balance: '⚖️ Equilibrio General',
      general: 'Opciones'
    };
    return labels[category] || category;
  };

  if (!currentQuestion) {
    return <div className="loading">Cargando cuestionario...</div>;
  }

  return (
    <div className="questionnaire-wrapper">
      {/* Header con progreso */}
      <div className="questionnaire-header">
        <button className="back-btn" onClick={onBack} type="button">
          ← Volver
        </button>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}% Completado</span>
        </div>
        <div className="step-counter">
          Paso {safeIndex + 1} de {visibleQuestions.length}
        </div>
      </div>

      {/* Tarjeta de pregunta */}
      <div className="question-card">
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

      {/* Navegación */}
      <div className="navigation-buttons">
        {safeIndex > 0 && (
          <button className="nav-btn secondary" onClick={handlePrevious} type="button">
            ← Anterior
          </button>
        )}
        
        {safeIndex < visibleQuestions.length - 1 ? (
          <button 
            className="nav-btn primary" 
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null}
            type="button"
          >
            Siguiente →
          </button>
        ) : (
          <button className="nav-btn submit" onClick={handleSubmit} type="button">
            {answers.goal === 'healing' ? '💚 Generar Mi Sesión de Sanación' : '🎧 Generar Mi Rutina Personalizada'}
          </button>
        )}
      </div>

      {/* Info de sanación */}
      {answers.goal === 'healing' && (
        <div className="healing-info-box">
          <p><strong>💚 Modo Sanación:</strong> Las frecuencias terapéuticas se combinan con beats binaurales.</p>
        </div>
      )}

      <p className="privacy-note">
        Tus respuestas se procesan localmente. No se comparten con terceros.
      </p>
    </div>
  );
}
