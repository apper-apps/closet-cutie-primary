import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Closet from "@/components/pages/Closet";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import * as outfitService from "@/services/api/outfitService";
import { getAll } from "@/services/api/moodboardService";

const OOTDGenerator = ({ onViewCloset }) => {
  const [outfits, setOutfits] = useState([]);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [shuffling, setShuffling] = useState(false);

  // Load weather data with comprehensive error handling
  const loadWeather = async () => {
    try {
      setWeatherLoading(true);
      setLocationError(null);
// Get user's location with timeout and detailed error handling
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('TIMEOUT'));
        }, 10000); // 10 second timeout

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            resolve(position);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Mock weather API call (replace with actual API)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=demo&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const weatherData = await response.json();
      
      setWeather({
        temp: Math.round(weatherData.main?.temp || 20),
        condition: weatherData.weather?.[0]?.main?.toLowerCase() || 'clear',
        location: weatherData.name || 'Unknown'
      });
} catch (err) {
      // Serialize error object properly for logging
      const serializedError = {
        message: err?.message || 'Unknown error',
        code: err?.code || 'N/A',
        type: err?.constructor?.name || typeof err,
        stack: err?.stack || 'No stack trace available'
      };
      
      console.error('Weather fetch failed:', serializedError);
      
      // Extract error message safely - ensure it's always a string
      const getErrorMessage = (error) => {
        if (!error) return 'Unknown error occurred';
        if (typeof error === 'string') return error;
        if (error.message && typeof error.message === 'string') return error.message;
        if (error.toString && typeof error.toString === 'function') {
          const stringified = error.toString();
          return stringified !== '[object Object]' ? stringified : 'Error object without message';
        }
        return 'Unknown error type';
      };
      
      // Handle specific geolocation errors with proper error extraction
      let errorMessage = 'Unable to get weather information';
      
      // Check if it's a GeolocationPositionError
      if (err && typeof err === 'object' && err.code !== undefined) {
        // Handle GeolocationPositionError with specific codes
        switch (err.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied. Please enable location services to get weather-appropriate outfit suggestions.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable. Using default weather for outfit suggestions.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out. Using default weather for outfit suggestions.';
            break;
          default:
            errorMessage = 'Location services error. Using default weather for outfit suggestions.';
        }
      } else if (getErrorMessage(err) === 'TIMEOUT') {
        errorMessage = 'Location request timed out. Using default weather for outfit suggestions.';
      } else if (getErrorMessage(err).includes('Weather API')) {
        errorMessage = 'Weather service unavailable. Using default conditions for outfit suggestions.';
      } else {
        // Use the safely extracted error message
        const safeMessage = getErrorMessage(err);
        errorMessage = `Weather service error: ${safeMessage}. Using default conditions for outfit suggestions.`;
      }
      
      // Ensure errorMessage is always a string before setting state
      setLocationError(typeof errorMessage === 'string' ? errorMessage : 'Weather service temporarily unavailable');
      
      // Set fallback weather data
      setWeather({
        temp: 22,
        condition: 'clear',
        location: 'Default Location'
      });
    } finally {
      setWeatherLoading(false);
    }
  };
  const loadOutfits = async () => {
    try {
      setError("");
      setLoading(true);
      let data;
      
      if (weather && !locationError) {
// Try to get weather-appropriate outfits first
        try {
          data = await outfitService.getByTemperatureRange(weather.temp);
          if (data.length === 0) {
            data = await outfitService.getByWeatherCondition(weather.condition);
          }
        } catch (weatherErr) {
          console.log('Weather-based filtering failed, using all outfits');
          data = await outfitService.getAll();
        }
      } else {
        data = await outfitService.getAll();
      }
      
      setOutfits(data);
      if (data.length > 0) {
        setCurrentOutfit(getRandomOutfit(data));
      }
    } catch (err) {
      setError("Failed to load your outfits. Let's try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  useEffect(() => {
    if (!weatherLoading) {
      loadOutfits();
    }
  }, [weather, weatherLoading]);

const getRandomOutfit = (outfitList = outfits) => {
    if (outfitList.length === 0) return null;
    let availableOutfits = outfitList;
    
    // If we have weather data, prefer weather-appropriate outfits
    if (weather && !locationError) {
      const weatherAppropriate = outfitList.filter(outfit => 
        isWeatherAppropriate(outfit, weather)
      );
      if (weatherAppropriate.length > 0) {
        availableOutfits = weatherAppropriate;
      }
    }
    
    const randomIndex = Math.floor(Math.random() * availableOutfits.length);
    return availableOutfits[randomIndex];
  };
const isWeatherAppropriate = (outfit, weatherData) => {
    const temp = weatherData.temp;
    const condition = weatherData.condition;
    
    // Temperature-based filtering
    const tags = (outfit.tags || []).map(tag => tag.toLowerCase());
    
    if (temp < 10) {
      return tags.some(tag => ['winter', 'coat', 'warm', 'cozy', 'sweater'].includes(tag));
    } else if (temp < 20) {
      return tags.some(tag => ['fall', 'autumn', 'layered', 'jacket', 'casual'].includes(tag)) ||
             !tags.some(tag => ['summer', 'beach', 'tank', 'shorts'].includes(tag));
    } else if (temp > 25) {
      return tags.some(tag => ['summer', 'light', 'beach', 'tank', 'shorts', 'sundress'].includes(tag)) ||
             !tags.some(tag => ['winter', 'coat', 'heavy', 'sweater'].includes(tag));
    }
    
    // Weather condition filtering
    if (['rain', 'drizzle'].includes(condition)) {
      return !tags.some(tag => ['white', 'light', 'delicate'].includes(tag));
    }
    
    return true;
  };

const generateCommentary = (outfit) => {
    if (!outfit) return "Loading your fabulous look! ✨";
const weatherCommentaries = weather && !locationError ? {
      hot: [
        `Perfect for this ${weather.temp}°C weather! Stay cool and chic! ☀️`,
        `Weather-approved gorgeousness for ${weather.temp}°C! 🌡️✨`,
        `Hot weather, hotter look! Perfect for today's ${weather.temp}°C! 🔥`
      ],
      mild: [
        `Ideal for today's lovely ${weather.temp}°C weather! 🌤️`,
`Ideal for today's lovely ${weather.temp}°C weather! 🌤️`,
        `Weather gods are smiling - perfect outfit for ${weather.temp}°C! ✨`,
        `Comfort meets style in this ${weather.temp}°C weather! 💕`
      ],
      cold: [
        `Cozy chic for this chilly ${weather.temp}°C day! ❄️✨`,
        `Bundled up and beautiful for ${weather.temp}°C! 🧥💖`,
        `Cold weather fashion icon vibes at ${weather.temp}°C! 🌨️`
      ],
      rainy: [
        `Rain-ready and runway-ready! Perfect for today's weather! ☔✨`,
        `Drizzle-proof diva energy! You'll slay through any storm! 🌧️💪`,
        `Weather might be gloomy, but your style is sunshine! 🌈`
      ]
    } : {};

    const commentaries = {
      "coquette": [
        "Serving soft girl realness 🌸",
        "You're giving princess vibes today! 👑",
        "Coquette queen energy activated! 🎀"
      ],
      "y2k": [
        "You're giving early 2000s romcom queen 💄👠",
        "Bringing back the Y2K magic! ✨",
        "Total butterfly clip princess vibes! 🦋"
      ],
      "cottagecore": [
        "Forest fairy aesthetic on point! 🌿",
        "Cottage living your best life! 🏡",
        "Giving main character in a cozy novel! 📚"
      ],
      "streetwear": [
        "Street style icon status unlocked! 🔥",
        "Urban princess energy! 👟",
        "Casual but make it fashion! ✨"
      ],
      "glam": [
        "Absolutely stunning! Red carpet ready! 💎",
        "Glamour goddess mode activated! ✨",
        "You're literally glowing! 🌟"
      ],
      "vintage": [
        "Retro queen serving looks! 👗",
        "Time travel chic! Love it! 🕰️",
        "Old Hollywood glamour vibes! 🎭"
      ],
      "default": [
        "Looking absolutely gorgeous today! 💖",
        "Main character energy activated! ✨",
        "You're serving looks and I'm here for it! 🔥",
        "Outfit perfection achieved! 👑",
        "Style icon status: CONFIRMED! ⭐"
      ]
    };

// Prioritize weather-based commentary if available
    if (weather && !locationError) {
      const temp = weather.temp;
      const condition = weather.condition;
      if (['rain', 'drizzle'].includes(condition) && weatherCommentaries.rainy) {
        const randomIndex = Math.floor(Math.random() * weatherCommentaries.rainy.length);
        return weatherCommentaries.rainy[randomIndex];
      } else if (temp > 25 && weatherCommentaries.hot) {
        const randomIndex = Math.floor(Math.random() * weatherCommentaries.hot.length);
        return weatherCommentaries.hot[randomIndex];
      } else if (temp < 10 && weatherCommentaries.cold) {
        const randomIndex = Math.floor(Math.random() * weatherCommentaries.cold.length);
        return weatherCommentaries.cold[randomIndex];
      } else if (weatherCommentaries.mild) {
        const randomIndex = Math.floor(Math.random() * weatherCommentaries.mild.length);
        return weatherCommentaries.mild[randomIndex];
      }
    }

    // Try to match outfit tags with commentary themes
    let matchedCommentary = commentaries.default;
    
    if (outfit.tags && outfit.tags.length > 0) {
      const tag = outfit.tags[0].toLowerCase();
      for (const [key, value] of Object.entries(commentaries)) {
        if (tag.includes(key) || key.includes(tag)) {
          matchedCommentary = value;
          break;
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * matchedCommentary.length);
    return matchedCommentary[randomIndex];
  };

const handleShuffle = () => {
    if (outfits.length === 0) return;
    
    setShuffling(true);
    
    // Create magical shuffle effect
    setTimeout(() => {
      const newOutfit = getRandomOutfit();
      setCurrentOutfit(newOutfit);
      setShuffling(false);
    }, 500);
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      clear: "Sun",
      clouds: "Cloud",
      rain: "CloudRain",
      drizzle: "CloudDrizzle",
      thunderstorm: "Zap",
      snow: "Snowflake",
      mist: "CloudFog",
      fog: "CloudFog"
    };
    return iconMap[condition] || "Sun";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOutfits} />;

  if (outfits.length === 0) {
    return (
      <Empty
        title="No outfits to suggest! 💔"
        description="Add some gorgeous pieces to your closet first, then come back for your daily style magic!"
        actionText="Build Your Closet"
        onAction={onViewCloset}
        icon="Shirt"
      />
    );
  }

return (
    <div className="space-y-6">
      {/* Header with Weather Widget */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-display text-gray-800">
            Today's Look ✨
          </h2>
          <p className="text-gray-600">
            {weather && !locationError 
              ? "Weather-smart style suggestions just for you!" 
              : "Your personal style oracle has spoken!"
            }
          </p>
        </div>
{/* Weather Widget */}
        {weather && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/80 p-3 rounded-full">
                  <ApperIcon 
                    name={getWeatherIcon(weather?.condition || 'clear')} 
                    className="w-8 h-8 text-blue-600" 
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {weather?.temp || '22'}°C
                  </p>
                  <p className="text-blue-600 capitalize">
                    {weather?.condition || 'clear'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">📍 Location</p>
                <p className="font-medium text-blue-900">
                  {weather?.location || 'Default Location'}
                </p>
              </div>
            </div>
            {locationError && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <ApperIcon name="AlertCircle" className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Weather Notice</p>
                    <p className="text-sm text-orange-700 mt-1">{locationError}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {locationError && !weather && (
          <Card className="bg-red-50 border-red-200 p-4 mb-6">
            <div className="flex items-center space-x-3">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Weather Unavailable</p>
                <p className="text-sm text-red-600">
                  {locationError}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Outfit Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentOutfit?.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-surface to-white relative">
            {shuffling && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center z-10 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl"
                >
                  ✨
                </motion.div>
              </div>
            )}
            
            <div className="aspect-square md:aspect-[4/3] relative overflow-hidden">
              <img
                src={currentOutfit?.imageUrl}
                alt={currentOutfit?.notes || "Today's outfit"}
                className="w-full h-full object-cover"
              />
              
              {/* Sparkle overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 text-2xl"
              >
                💖
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-4 left-4 text-xl"
              >
                ✨
              </motion.div>
            </div>

            <div className="p-6 space-y-4">
              {/* Commentary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-display text-gray-800 mb-2">
                  {generateCommentary(currentOutfit)}
                </h3>
                {currentOutfit?.notes && (
                  <p className="text-gray-600 italic">
                    "{currentOutfit.notes}"
                  </p>
                )}
              </motion.div>

              {/* Outfit Details */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">{currentOutfit?.category}</Badge>
                {currentOutfit?.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={handleShuffle}
                  disabled={shuffling}
                  icon="Shuffle"
                  size="lg"
                  className="flex-1 max-w-xs"
                >
                  {shuffling ? "Casting Magic..." : "Shuffle Look"}
                </Button>
                
                <Button
                  onClick={onViewCloset}
                  variant="outline"
                  icon="Shirt"
                  size="lg"
                >
                  My Closet
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {outfits.length}
          </div>
          <div className="text-sm text-gray-600">Total Looks</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            {outfits.filter(o => o.rating >= 4).length}
          </div>
          <div className="text-sm text-gray-600">Fave Pieces</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">
            {new Set(outfits.flatMap(o => o.tags || [])).size}
          </div>
          <div className="text-sm text-gray-600">Style Tags</div>
        </Card>
      </div>
    </div>
  );
};

export default OOTDGenerator;