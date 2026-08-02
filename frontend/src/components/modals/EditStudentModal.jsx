import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, SEMESTERS, DIVISIONS } from '../../mockData/studentData';

export const EditStudentModal = () => {
  const {
  activeModal,
  setActiveModal,
  selectedStudent,
  updateStudent
} = useApp();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
  registrationId: '',
  name: '',
  rollNo: '',
  email: '',
  department: DEPARTMENTS[0],
  semester: 6,
  division: 'A',
  guardianName: '',
  guardianPhone: ''
});

useEffect(() => {
  if (!selectedStudent) return;

  setFormData({
    registrationId: selectedStudent.registrationId,
    name: selectedStudent.fullName,
    rollNo: selectedStudent.rollNumber,
    email: selectedStudent.email,
    department: selectedStudent.departmentName,
    semester: selectedStudent.semester,
    division: selectedStudent.division,
    guardianName: selectedStudent.guardianName || "",
    guardianPhone: selectedStudent.guardianPhone || ""
  });

}, [selectedStudent]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.registrationId ||
    !formData.name ||
    !formData.rollNo ||
    !formData.email
  ) {
    addToast(
      "Validation Error",
      "Please fill all required fields.",
      "warning"
    );
    return;
  }

  await updateStudent(selectedStudent.id, formData);

  addToast(
    "Student Updated",
    `${formData.name} updated successfully.`,
    "success"
  );

  setActiveModal(null);
};

  return (
    <Modal
      isOpen={activeModal === 'editStudent'}
      onClose={() => setActiveModal(null)}
      title="Edit Student Record"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registration ID *
            </label>

            <input
              type="text"
              required
              placeholder="STU-2026-001"
              value={formData.registrationId}
              onChange={(e)=>
                setFormData({...formData,registrationId:e.target.value})
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number*</label>
            <input
              type="text"
              required
              placeholder="CS2445"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
      Full Name *
    </label>
    <input
      type="text"
      required
      placeholder="Rahul Sharma"
      value={formData.name}
      onChange={(e) =>
        setFormData({ ...formData, name: e.target.value })
      }
      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
    />
  </div>

  <div>
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
      Institutional Email *
    </label>
    <input
      type="email"
      required
      placeholder="rahul.sharma@institution.edu"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
    />
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department*</label>
            <select
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester*</label>
            <select
              required
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
            >
              {SEMESTERS.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Division*</label>
            <select
              required
              value={formData.division}
              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
            >
              {DIVISIONS.map(d => (
                <option key={d} value={d}>Division {d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Name*</label>
            <input
              type="text"
              required
              placeholder="Vijay Sharma"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Contact Phone*</label>
            <input
              type="text"
              required
              placeholder="+91"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 transition-all"
          >
            Edit Student
          </button>
        </div>
      </form>
    </Modal>
  );
};
