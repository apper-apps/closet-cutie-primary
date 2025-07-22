import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as outfitService from "@/services/api/outfitService";
import { toast } from "react-toastify";

const CalendarView = ({ selectedDate, onDateSelect, onCloseModal }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [planningForm, setPlanningForm] = useState({
    eventTitle: "",
    reminder: true
  });

  const loadOutfits = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await outfitService.getPlanningData();
      setOutfits(data);
    } catch (err) {
      setError("Failed to load calendar data. Let's try again! 📅");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutfits();
  }, []);

  // Generate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get planned outfits for a specific date
  const getPlannedOutfits = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const plannedOutfits = [];
    
    outfits.forEach(outfit => {
      const plannedDates = outfit.plannedDates || [];
      plannedDates.forEach(planning => {
        if (planning.date === dateStr) {
          plannedOutfits.push({
            ...outfit,
            planning
          });
        }
      });
    });
    
    return plannedOutfits;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
    const plannedOutfits = getPlannedOutfits(date);
    if (plannedOutfits.length === 0) {
      setShowPlanningModal(true);
    }
  };

  const handleOutfitSelect = (outfit) => {
    setSelectedOutfit(outfit);
    setShowPlanningModal(true);
  };

  const handlePlanOutfit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedOutfit) return;
    
    try {
      const planningData = {
        outfitId: selectedOutfit.Id,
        date: format(selectedDate, "yyyy-MM-dd"),
        eventTitle: planningForm.eventTitle,
        reminder: planningForm.reminder
      };
      
      await outfitService.createPlanning(planningData);
      await loadOutfits();
      
      toast.success(`Outfit planned for ${format(selectedDate, "MMM d")}! 📅✨`);
      
      setShowPlanningModal(false);
      setSelectedOutfit(null);
      setPlanningForm({ eventTitle: "", reminder: true });
      onCloseModal();
    } catch (err) {
      toast.error("Failed to plan outfit. Please try again! 💖");
    }
  };

  const handleRemovePlanning = async (outfit, planningId) => {
    try {
      await outfitService.deletePlanning(outfit.Id, planningId);
      await loadOutfits();
      toast.success("Outfit planning removed! 📅");
    } catch (err) {
      toast.error("Failed to remove planning. Please try again! 💖");
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadOutfits} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-gray-800">
          Style Calendar 📅
        </h2>
        <p className="text-gray-600">
          Plan your perfect outfits for upcoming events!
        </p>
      </div>

      {/* Calendar Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            icon="ChevronLeft"
            onClick={handlePreviousMonth}
          />
          
          <h3 className="text-xl font-display text-gray-800">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            icon="ChevronRight"
            onClick={handleNextMonth}
          />
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const plannedOutfits = getPlannedOutfits(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(day)}
                className={`
                  relative p-2 h-20 border rounded-lg transition-all duration-200
                  ${isCurrentMonth ? "bg-white hover:bg-primary/5" : "bg-gray-50 text-gray-400"}
                  ${isTodayDate ? "border-primary bg-primary/10" : "border-gray-200"}
                  ${isSelected ? "border-accent bg-accent/10" : ""}
                `}
              >
                <div className="text-sm font-medium">
                  {format(day, "d")}
                </div>
                
                {plannedOutfits.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="flex gap-1 justify-center">
                      {plannedOutfits.slice(0, 2).map((outfit, idx) => (
                        <div
                          key={idx}
                          className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      ))}
                      {plannedOutfits.length > 2 && (
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <div className="text-xs text-primary mt-1">
                      {plannedOutfits.length} planned
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Selected Date Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-gray-800">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon="X"
                  onClick={onCloseModal}
                />
              </div>

              {(() => {
                const plannedOutfits = getPlannedOutfits(selectedDate);
                
                if (plannedOutfits.length === 0) {
                  return (
                    <Empty
                      title="No outfits planned! 👗"
                      description="Select an outfit to plan for this date!"
                      actionText="Plan Outfit"
                      onAction={() => setShowPlanningModal(true)}
                      icon="Plus"
                    />
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">
                        Planned Outfits ({plannedOutfits.length})
                      </h4>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="Plus"
                        onClick={() => setShowPlanningModal(true)}
                      >
                        Add More
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {plannedOutfits.map(outfit => (
                        <motion.div
                          key={`${outfit.Id}-${outfit.planning.Id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
                        >
                          <img
                            src={outfit.imageUrl}
                            alt={outfit.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">
                              {outfit.name}
                            </h5>
                            {outfit.planning.eventTitle && (
                              <p className="text-sm text-gray-600">
                                Event: {outfit.planning.eventTitle}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" size="sm">
                                {outfit.category}
                              </Badge>
                              {outfit.planning.reminder && (
                                <Badge variant="primary" size="sm">
                                  <ApperIcon name="Bell" size={12} className="mr-1" />
                                  Reminder
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Trash2"
                            onClick={() => handleRemovePlanning(outfit, outfit.planning.Id)}
                            className="text-red-500 hover:text-red-700"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planning Modal */}
      <AnimatePresence>
        {showPlanningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display text-gray-800">
                    Plan Outfit for {selectedDate && format(selectedDate, "MMM d")}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="X"
                    onClick={() => {
                      setShowPlanningModal(false);
                      setSelectedOutfit(null);
                    }}
                  />
                </div>

                {!selectedOutfit ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Select an Outfit:</h4>
                    <div className="grid gap-3 max-h-60 overflow-y-auto">
                      {outfits.map(outfit => (
                        <motion.button
                          key={outfit.Id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOutfitSelect(outfit)}
                          className="flex items-center gap-3 p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-primary/30 transition-colors"
                        >
                          <img
                            src={outfit.imageUrl}
                            alt={outfit.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">
                              {outfit.name}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {outfit.category}
                            </p>
                          </div>
                          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePlanOutfit} className="space-y-6">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <img
                        src={selectedOutfit.imageUrl}
                        alt={selectedOutfit.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {selectedOutfit.name}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {selectedOutfit.category}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Title (Optional)
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., Dinner with friends, Work meeting..."
                          value={planningForm.eventTitle}
                          onChange={(e) => setPlanningForm(prev => ({
                            ...prev,
                            eventTitle: e.target.value
                          }))}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="reminder"
                          checked={planningForm.reminder}
                          onChange={(e) => setPlanningForm(prev => ({
                            ...prev,
                            reminder: e.target.checked
                          }))}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="reminder" className="text-sm font-medium text-gray-700">
                          Set reminder notification
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedOutfit(null)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                      >
                        Plan Outfit
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;