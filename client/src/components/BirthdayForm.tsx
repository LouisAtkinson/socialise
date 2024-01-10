import { FormState, BirthdayFormProps } from "../types/types";
import React, { Dispatch, SetStateAction } from 'react';

const BirthdayForm = ({formState, handleInputChange}: BirthdayFormProps) => {
    const monthsArray = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const getDaysInMonth = (month: string) => {
      const daysInMonth = new Date(2023, monthsArray.indexOf(month) + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    };
  
    return (
      <div className="select-container">
        <select
          name="birthMonth"
          value={formState.birthMonth || ''}
          onChange={handleInputChange}
          className="select-input"
        >
          <option value="">Month</option>
          {monthsArray.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          name="birthDay"
          value={formState.birthDay || ''}
          onChange={handleInputChange}
          disabled={!formState.birthMonth}
          className="select-input"
        >
          <option value="">Day</option>
          {formState.birthMonth &&
            getDaysInMonth(formState.birthMonth).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
        </select>
      </div>
    );
  };
  
  export default BirthdayForm;  