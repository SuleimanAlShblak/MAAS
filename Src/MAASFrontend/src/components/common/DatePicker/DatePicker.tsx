import { useEffect, useId, useRef, useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { CalendarDaysOutlined } from "@lineiconshq/free-icons";
import { cn } from "@/utils/cs";
import Input from "@/components/common/Input/Input";
import { parseDate } from "./date";
import "./DatePicker.css";

type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
};

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthLabels = Array.from({ length: 12 }, (_, month) =>
  new Date(2000, month, 1).toLocaleDateString(undefined, { month: "long" }),
);

const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

const sameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export default function DatePicker({
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}: DatePickerProps) {
  const selectedDate = parseDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(
    () => selectedDate ?? new Date(),
  );
  const pickerRef = useRef<HTMLDivElement>(null);
  const calendarId = useId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const openCalendar = () => {
    if (disabled) return;
    setDisplayedMonth(selectedDate ?? new Date());
    setIsOpen(true);
  };

  const firstDayOfMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    0,
  ).getDate();
  const leadingEmptyDays = firstDayOfMonth.getDay();
  const calendarDays = Array.from(
    { length: leadingEmptyDays + daysInMonth },
    (_, index) => index - leadingEmptyDays + 1,
  );
  const isCurrentMonth =
    displayedMonth.getFullYear() === today.getFullYear() &&
    displayedMonth.getMonth() === today.getMonth();
  const years = Array.from(
    { length: today.getFullYear() - 1899 },
    (_, index) => today.getFullYear() - index,
  );

  const setMonth = (month: number) => {
    setDisplayedMonth((current) => {
      const year = current.getFullYear();
      if (year === today.getFullYear() && month > today.getMonth()) {
        return new Date(year, today.getMonth(), 1);
      }
      return new Date(year, month, 1);
    });
  };

  const setYear = (year: number) => {
    setDisplayedMonth((current) => {
      const month =
        year === today.getFullYear() && current.getMonth() > today.getMonth()
          ? today.getMonth()
          : current.getMonth();
      return new Date(year, month, 1);
    });
  };

  const selectDate = (day: number) => {
    const date = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth(),
      day,
    );
    if (date > today) return;

    onChange(formatDate(date));
    setIsOpen(false);
  };

  return (
    <div className="date-picker" ref={pickerRef}>
      <Input
        label={label}
        value={value}
        placeholder="DD.MM.YYYY"
        readOnly
        required={required}
        disabled={disabled}
        error={error}
        aria-expanded={isOpen}
        aria-controls={calendarId}
        onClick={openCalendar}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCalendar();
          }
        }}
        icon={
          <Lineicons
            icon={CalendarDaysOutlined}
            size={18}
            strokeWidth={1.8}
            className="register-field-icon"
          />
        }
        className="cursor-pointer"
      />

      {isOpen && (
        <div
          id={calendarId}
          className="date-picker-popover"
          role="dialog"
          aria-label="Choose date of birth"
        >
          <div className="date-picker-navigation">
            <button
              type="button"
              className="date-picker-nav-button"
              onClick={() =>
                setDisplayedMonth(
                  (month) =>
                    new Date(month.getFullYear(), month.getMonth() - 1, 1),
                )
              }
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="date-picker-period">
              <select
                aria-label="Month"
                value={displayedMonth.getMonth()}
                onChange={(event) =>
                  setMonth(Number(event.currentTarget.value))
                }
              >
                {monthLabels.map((month, index) => (
                  <option
                    key={month}
                    value={index}
                    disabled={
                      displayedMonth.getFullYear() === today.getFullYear() &&
                      index > today.getMonth()
                    }
                  >
                    {month}
                  </option>
                ))}
              </select>
              <select
                aria-label="Year"
                value={displayedMonth.getFullYear()}
                onChange={(event) => setYear(Number(event.currentTarget.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="date-picker-nav-button"
              onClick={() =>
                setDisplayedMonth(
                  (month) =>
                    new Date(month.getFullYear(), month.getMonth() + 1, 1),
                )
              }
              aria-label="Next month"
              disabled={isCurrentMonth}
            >
              ›
            </button>
          </div>
          <div className="date-picker-weekdays" aria-hidden="true">
            {weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="date-picker-days">
            {calendarDays.map((day, index) => {
              if (day < 1) return <span key={`empty-${index}`} />;
              const date = new Date(
                displayedMonth.getFullYear(),
                displayedMonth.getMonth(),
                day,
              );
              const isFuture = date > today;
              const isSelected = selectedDate
                ? sameDay(date, selectedDate)
                : false;
              return (
                <button
                  type="button"
                  key={day}
                  disabled={isFuture}
                  aria-pressed={isSelected}
                  aria-label={date.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  className={cn(
                    "date-picker-day",
                    sameDay(date, today) && "date-picker-day-today",
                    isSelected && "date-picker-day-selected",
                  )}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
