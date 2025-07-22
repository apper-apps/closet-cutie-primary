import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { getPersonaRecommendations } from '@/services/api/moodboardService';
import { toast } from 'react-toastify';

const StylePersonaQuiz = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 'style_preference',
      title: 'What style speaks to your soul?',
      emoji: '✨',
      options: [
        { value: 'minimalist', label: 'Clean & Minimal', desc: 'Less is more vibes' },
        { value: 'romantic', label: 'Soft & Romantic', desc: 'Dreamy feminine energy' },
        { value: 'edgy', label: 'Bold & Edgy', desc: 'Statement making looks' },
        { value: 'vintage', label: 'Vintage & Retro', desc: 'Timeless classic pieces' }
      ]
    },
    {
      id: 'color_palette',
      title: 'Which color palette makes your heart skip?',
      emoji: '🎨',
      options: [
        { value: 'pastels', label: 'Soft Pastels', desc: 'Baby pink, lavender, mint' },
        { value: 'neutrals', label: 'Warm Neutrals', desc: 'Beige, cream, camel' },
        { value: 'jewel_tones', label: 'Rich Jewel Tones', desc: 'Emerald, sapphire, ruby' },
        { value: 'monochrome', label: 'Classic Monochrome', desc: 'Black, white, grey' }
      ]
    },
    {
      id: 'lifestyle',
      title: 'What describes your lifestyle best?',
      emoji: '💫',
      options: [
        { value: 'creative', label: 'Creative & Artistic', desc: 'Museums, cafes, inspiration' },
        { value: 'professional', label: 'Professional & Polished', desc: 'Meetings, networking, success' },
        { value: 'casual', label: 'Relaxed & Comfortable', desc: 'Cozy days, simple pleasures' },
        { value: 'social', label: 'Social & Adventurous', desc: 'Events, travel, experiences' }
      ]
    },
    {
      id: 'inspiration',
      title: 'What inspires your fashion choices?',
      emoji: '🌙',
      options: [
        { value: 'nature', label: 'Nature & Seasons', desc: 'Earth tones, organic textures' },
        { value: 'art', label: 'Art & Culture', desc: 'Museums, galleries, creativity' },
        { value: 'travel', label: 'Travel & Adventure', desc: 'Global influences, wanderlust' },
        { value: 'mood', label: 'Emotions & Mood', desc: 'How I feel in the moment' }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculatePersona({ ...answers, [questionId]: answer });
    }
  };

  const calculatePersona = async (finalAnswers) => {
    setLoading(true);
    try {
      const persona = await getPersonaRecommendations(finalAnswers);
      setResult(persona);
      toast.success('Your style persona has been discovered! ✨');
    } catch (error) {
      toast.error('Oops! Something went wrong. Please try again.');
      console.error('Error calculating persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-8 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>

            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  ✨
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Calculating your style persona...
                </h3>
                <p className="text-gray-600">This will just take a moment!</p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="text-6xl mb-4">{result.emoji}</div>
                  <h2 className="text-3xl font-display text-gray-800 mb-2">
                    {result.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {result.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Aesthetic Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.aestheticTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Recommended Starter Packs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.starterPacks.map((pack, index) => (
                      <Card key={index} className="p-4 text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{pack.emoji}</span>
                          <h4 className="font-semibold text-gray-800">
                            {pack.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {pack.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {pack.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetQuiz} variant="outline">
                    Take Quiz Again
                  </Button>
                  <Button onClick={handleClose} variant="primary">
                    Start Creating! ✨
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      Question {currentStep + 1} of {questions.length}
                    </div>
                    <div className="text-2xl">
                      {questions[currentStep].emoji}
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    />
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {questions[currentStep].title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {questions[currentStep].options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.desc}
                          </p>
                        </div>
                        <ApperIcon 
                          name="ChevronRight" 
                          className="text-gray-400 group-hover:text-primary transition-colors" 
                          size={20} 
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      icon="ChevronLeft"
                      iconPosition="left"
                    >
                      Back
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StylePersonaQuiz;