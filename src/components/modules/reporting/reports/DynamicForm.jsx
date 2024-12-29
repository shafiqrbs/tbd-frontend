import React, { useState } from "react";
import { TextInput, Select, Button } from "@mantine/core";

const MonthPicker = (props) => {
  const { value, onChange } = props;
  return (
    <Select
      label="Month"
      placeholder="Select Month"
      data={[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]}
      value={value}
      onChange={onChange}
    />
  );
};

const YearPicker = (props) => {
  const { value, onChange } = props;
  return (
    <Select
      label="Year"
      placeholder="Select Year"
      data={Array.from({ length: 10 }, (_, i) => (2020 + i).toString())}
      value={value}
      onChange={onChange}
    />
  );
};

const DynamicForm = (props) => {
  const { schema, formType } = props;
  const fields = schema[formType];
  const [formValues, setFormValues] = useState({});

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    console.log(`${formType} Data :`, formValues);
  };
  return (
    <div>
      <h2>{formType}</h2>
      {fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <TextInput
                key={field.name}
                label={field.label}
                value={formValues[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            );
          case "monthpicker":
            return (
              <MonthPicker
                key={field.name}
                value={formValues[field.name] || ""}
                onChange={(value) => handleChange(field.name, value)}
              />
            );
          case "yearpicker":
            return (
              <YearPicker
                key={field.name}
                value={formValues[field.name] || ""}
                onChange={(value) => handleChange(field.name, value)}
              />
            );
          case "dropdown":
            return (
              <Select
                key={field.name}
                label={field.label}
                placeholder="Select an option"
                data={field.options}
                value={formValues[field.name] || ""}
                onChange={(value) => handleChange(field.name, value)}
              />
            );
          default:
            return null;
        }
      })}
      <Button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Submit
      </Button>
    </div>
  );
};
export default DynamicForm;
