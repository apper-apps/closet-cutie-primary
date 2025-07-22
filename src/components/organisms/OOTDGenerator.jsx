import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as outfitService from "@/services/api/outfitService";

const OOTDGenerator = ({ onViewCloset }) => {
  const [outfits, setOutfits] = useState([]);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shuffling, setShuffling] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

const loadWeather = async () => {
    try {
      setWeatherLoading(true);
      setLocationError(false);
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const weatherData = await response.json();
      setWeather({
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main.toLowerCase(),
        description: weatherData.weather[0].description,
        location: weatherData.name,
        humidity: weatherData.main.humidity,
        feelsLike: Math.round(weatherData.main.feels_like)
      });
    } catch (err) {
      console.error('Weather fetch failed:', err);
      setLocationError(true);
      setWeather(null);
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
          data = await outfitService.getByTemperatureRange(weather.temperature);
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
    const temp = weatherData.temperature;
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
        `Perfect for this ${weather.temperature}°C weather! Stay cool and chic! ☀️`,
        `Weather-approved gorgeousness for ${weather.temperature}°C! 🌡️✨`,
        `Hot weather, hotter look! Perfect for today's ${weather.temperature}°C! 🔥`
      ],
      mild: [
        `Ideal for today's lovely ${weather.temperature}°C weather! 🌤️`,
        `Weather gods are smiling - perfect outfit for ${weather.temperature}°C! ✨`,
        `Comfort meets style in this ${weather.temperature}°C weather! 💕`
      ],
      cold: [
        `Cozy chic for this chilly ${weather.temperature}°C day! ❄️✨`,
        `Bundled up and beautiful for ${weather.temperature}°C! 🧥💖`,
        `Cold weather fashion icon vibes at ${weather.temperature}°C! 🌨️`
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
      const temp = weather.temperature;
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
        {!weatherLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-4 py-2 backdrop-blur-sm border border-primary/20"
          >
            {weather && !locationError ? (
              <>
                <ApperIcon 
                  name={getWeatherIcon(weather.condition)} 
                  size={20} 
                  className="text-primary" 
                />
                <div className="text-sm font-medium text-gray-700">
                  {weather.temperature}°C • {weather.description} • {weather.location}
                </div>
              </>
            ) : (
              <>
                <ApperIcon name="MapPin" size={20} className="text-gray-400" />
                <div className="text-sm text-gray-500">
                  Weather unavailable • Classic suggestions ready!
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Main OOTD Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentOutfit?.Id || "loading"}
          initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
          transition={{ duration: 0.5 }}
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