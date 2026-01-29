import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import ManWithChecklist from '../../assets/man_with_checklist.png'

type SignupFormValues = {
  name: string
  email: string
  password: string
}

const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
})

export const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(schema),
  })

  const navigate = useNavigate()
  const { signup } = useAuth()

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast.success('Account created successfully')
      navigate('/select-role')
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'Failed to create account'
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-auth-bg flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="w-full max-w-lg">
          <img
            src={ManWithChecklist}
            alt="Productivity Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-2 text-slate-500">
              Get started with task management in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-900"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={`w-full h-12 rounded-xl bg-white border px-4 text-sm outline-none transition-all placeholder:text-slate-400
                  ${errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                  }`}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-900"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className={`w-full h-12 rounded-xl bg-white border px-4 text-sm outline-none transition-all placeholder:text-slate-400
                  ${errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                  }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-900"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className={`w-full h-12 rounded-xl bg-white border px-4 text-sm outline-none transition-all placeholder:text-slate-400
                  ${errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                  }`}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium shadow-primary-500/30 shadow-lg hover:shadow-primary-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

