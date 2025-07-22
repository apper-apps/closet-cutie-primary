import { useState } from "react";
import { motion } from "framer-motion";
import CalendarView from "@/components/organisms/CalendarView";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pb-24 px-4 pt-8"
    >
      <CalendarView 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onCloseModal={handleCloseModal}
      />
    </motion.div>
  );
};

export default Calendar;