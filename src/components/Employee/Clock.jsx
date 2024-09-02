import React, { useState, useEffect } from "react";

const Clock = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="text-center mb-14">
      <div className="text-4xl font-bold mb-2">
        {dateTime.toLocaleTimeString()}
      </div>
      <div className="text-xl">{formatDate(dateTime)}</div>
    </div>
  );
};

export default Clock;
