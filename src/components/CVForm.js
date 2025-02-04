import React, { useState } from "react";
import jsPDF from "jspdf";
import "./CVForm.css"; // Create this file for custom styling

const CVForm = ({ closeCVForm }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    location: "",
    skills: [{ skillName: "", proficiency: "" }],
    workExperience: [
      { jobTitle: "", employer: "", duration: "", description: "" },
    ],
  });

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index][name] = value;
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { skillName: "", proficiency: "" }],
    });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        { jobTitle: "", employer: "", duration: "", description: "" },
      ],
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Curriculum Vitae", 105, 20, null, null, "center");

    doc.setFontSize(16);
    doc.text("Personal Information", 10, 40);

    doc.setFontSize(12);
    doc.text(`Full Name: ${formData.fullName}`, 10, 50);
    doc.text(`Contact: ${formData.contact}`, 10, 60);
    doc.text(`Email: ${formData.email}`, 10, 70);
    doc.text(`Location: ${formData.location}`, 10, 80);

    doc.setFontSize(16);
    doc.text("Skills", 10, 100);

    formData.skills.forEach((skill, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${skill.skillName} - ${skill.proficiency}`, 10, 110 + index * 10);
    });

    let experienceStartY = 130 + formData.skills.length * 10;

    doc.setFontSize(16);
    doc.text("Work Experience", 10, experienceStartY);

    formData.workExperience.forEach((experience, index) => {
      doc.setFontSize(12);
      const y = experienceStartY + (index + 1) * 20;

      doc.text(`Job Title: ${experience.jobTitle}`, 10, y);
      doc.text(`Employer: ${experience.employer}`, 10, y + 10);
      doc.text(`Duration: ${experience.duration}`, 10, y + 20);
      doc.text(`Description: ${experience.description}`, 10, y + 30);
    });

    doc.save("CV.pdf");
  };

  return (
    <div className="cv-upgrade-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Upgrade Your CV</h2>

        <h3>Personal Information</h3>
        <div className="form-section">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-section">
          <label>Contact Number:</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="form-section">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-section">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <h3>Skills</h3>
        {formData.skills.map((skill, index) => (
          <div className="form-section" key={index}>
            <label>Skill:</label>
            <input
              type="text"
              name="skillName"
              value={skill.skillName}
              onChange={(e) => handleChange(e, index, "skills")}
              required
            />
            <label>Proficiency:</label>
            <select
              name="proficiency"
              value={skill.proficiency}
              onChange={(e) => handleChange(e, index, "skills")}
            >
              <option value="">Select Proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addSkill}>
          Add Skill
        </button>

        <h3>Work Experience</h3>
        {formData.workExperience.map((experience, index) => (
          <div className="form-section" key={index}>
            <label>Job Title:</label>
            <input
              type="text"
              name="jobTitle"
              value={experience.jobTitle}
              onChange={(e) => handleChange(e, index, "workExperience")}
              required
            />
            <label>Employer/Company:</label>
            <input
              type="text"
              name="employer"
              value={experience.employer}
              onChange={(e) => handleChange(e, index, "workExperience")}
            />
            <label>Duration:</label>
            <input
              type="text"
              name="duration"
              value={experience.duration}
              onChange={(e) => handleChange(e, index, "workExperience")}
            />
            <label>Job Description:</label>
            <textarea
              name="description"
              rows="4"
              value={experience.description}
              onChange={(e) => handleChange(e, index, "workExperience")}
            />
          </div>
        ))}
        <button type="button" onClick={addWorkExperience}>
          Add Work Experience
        </button>

        <button type="button" onClick={generatePDF} className="submit-btn">
          Generate CV
        </button>
        <button type="button" onClick={closeCVForm} className="cancel-btn">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CVForm;
