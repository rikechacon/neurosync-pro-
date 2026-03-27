import { useState, useEffect, useMemo } from 'react';
import { getOrderedQuestions, validateAnswers, getQuestionProgress } from './questions';
import { mapAnswersToRoutine } from '../../utils/frequencyMapper';
import './Questionnaire.css';

export default function Questionnaire({ onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [showHealingSubquestion, setShowHealingSubquestion] = useState(false);

  // Obtener preguntas base
  const allQuestions = useMemo(() => getOrderedQuestions(), []);

  // Filtrar preguntas visibles según respuestas
  const visibleQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      // Si es pregunta condicional, verificar condición
      if (q.conditional?.showIf) {
        const { goal, value } = q.conditional.showIf;
        return answers[goal] === value;
      }
      return true; // Preguntas normales siempre visibles
    });
  }, [allQuestions, answers]);

  // Calcular índice actual basado en preguntas visibles
  const [visibleIndex, setVisibleIndex] = useState(0);
  const currentQuestion = visibleQuestions[visibleIndex];
  const totalVisible = visibleQuestions.length;
  const progress = getQuestionProgress(visibleIndex, totalVisible);

  // Efecto: Mostrar sub-pregunta de sanación si aplica
  useEffect(() => {
    if (answers.goal === 'healing') {
      setShowHealingSubquestion(true);
    } else {
      setShowHealingSubquestion(false);
      // Limpiar respuesta de healing_type si cambió de opinión
      if (answers.healing_type) {
        setAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers.healing_type;
          return newAnswers;
        });
      }
    }
  }, [answers.goal]);

  // Efecto: Resetear índice si cambian las preguntas visibles
  useEffect(() => {
    setVisibleIndex(0);
  }, [visibleQuestions.length]);

  // Manejar respuesta de tipo escala
  const handleScaleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  // Manejar respuesta de opción única
  const handleSingleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: null }));

    // Si es la pregunta goal y selecciona healing, mostrar sub-pregunta
    if (questionId === 'goal' && value === 'healing') {
      setShowHealingSubquestion(true);
    }

    // Avanzar automáticamente con animación (solo si no es pregunta condicional pendiente)
    const question = visibleQuestions.find(q => q.id === questionId);
    if (question && !question.conditional) {
      setTimeout(() => {
        if (visibleIndex < totalVisible - 1) {
          setVisibleIndex(prev => prev + 1);
        }
      }, 250);
    }
  };

  // Navegación manual
  const handleNext = () => {
    if (visibleIndex < totalVisible - 1) {
      setVisibleIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (visibleIndex > 0) {
      setVisibleIndex(prev => prev - 1);
    }
  };

  // Enviar respuestas
  const handleSubmit = () => {
    const validation = validateAnswers(answers);
    
    if (!validation.valid) {
      setErrors({ submit: validation.message });
      const errorElement = document.querySelector('.error-message');
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const routine = mapAnswersToRoutine(answers);
    onComplete?.(routine);
  };

  // Renderizar input según tipo
  const renderQuestionInput = (question) => {
    if (question.type === 'scale') {
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
    }

    if (question.type === 'single') {
      // Agrupar opciones por categoría si existen
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
                  const isHealingOption = question.id === 'goal' && option.isHealing;
                  
                  return (
                    <button
                      key={option.value}
                      className={`option-card ${isSelected ? 'selected' : ''} ${isFeatured ? 'featured' : ''} ${isHealingOption ? 'healing-trigger' : ''}`}
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

  // Label para categorías de sanación
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
          Paso {visibleIndex + 1} de {totalVisible}
        </div>
      </div>

      {/* Tarjeta de pregunta */}
      <div className="question-card">
        <div className="question-content">
          <h2 className="question-text">{currentQuestion?.text}</h2>
          
          {currentQuestion?.hint && (
            <p className="question-hint">💡 {currentQuestion.hint}</p>
          )}
          
          {currentQuestion && (
            <div className="question-input">
              {renderQuestionInput(currentQuestion)}
            </div>
          )}
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
        {visibleIndex > 0 && (
          <button className="nav-btn secondary" onClick={handlePrevious} type="button">
            ← Anterior
          </button>
        )}
        
        {visibleIndex < totalVisible - 1 ? (
          <button 
            className="nav-btn primary" 
            onClick={handleNext}
            disabled={answers[currentQuestion?.id] === undefined}
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
          <p><strong>💚 Modo Sanación:</strong> Las frecuencias terapéuticas se combinan con beats binaurales para potenciar sus efectos. Se recomienda usar auriculares y un ambiente tranquilo.</p>
          <p className="disclaimer"><em>Nota: Estas frecuencias son complementarias y no sustituyen tratamiento médico profesional.</em></p>
        </div>
      )}

      {/* Nota de privacidad */}
      <p className="privacy-note">
        Tus respuestas se procesan localmente. No se comparten con terceros.
      </p>
    </div>
  );
}
