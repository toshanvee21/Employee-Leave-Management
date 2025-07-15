import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import projectReducer from './slices/projectSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    projects: projectReducer,
  },
});
