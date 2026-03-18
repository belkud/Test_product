import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export const clientSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  company: yup.string().required('Company is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  status: yup.string().oneOf(['active', 'inactive', 'pending']).required('Status is required'),
})

export const projectSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required'),
  clientId: yup.number().required('Client is required'),
  status: yup.string().oneOf(['planning', 'in-progress', 'review', 'completed', 'on-hold']).required('Status is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  budget: yup.number().positive('Budget must be positive').required('Budget is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().optional(),
})

export const taskSchema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required'),
  projectId: yup.number().required('Project is required'),
  status: yup.string().oneOf(['todo', 'in-progress', 'done']).required('Status is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  dueDate: yup.string().optional(),
})

export const profileSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().optional(),
})

export const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
})
