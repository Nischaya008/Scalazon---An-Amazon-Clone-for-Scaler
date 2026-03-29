'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

type Mode = 'signin' | 'signup' | 'verify_otp'

export default function EnterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<Mode>('signin')
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [otp, setOtp] = useState('')

  // Validation
  const validateManualForm = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Invalid email format')
      return false
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    if (mode === 'signup') {
      if (password !== rePassword) {
        toast.error('Passwords do not match')
        return false
      }
      if (username.length < 3) {
        toast.error('Username must be at least 3 characters')
        return false
      }
    }
    return true
  }

  const handleManualAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateManualForm()) return

    setIsLoading(true)

    try {
      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { user_name: username }
          }
        })

        if (error) {
          // Attempting to catch the specific mismatch constraint requested
          if (error.message.toLowerCase().includes('already registered')) {
            toast.error('Account already registered via manual form or Google/Amazon. Try signing in.')
          } else {
            toast.error(error.message)
          }
        } else {
          // If signup is successful and requires OTP
          if (data.session) {
            toast.success('Account created successfully!')
            router.push('/')
          } else {
            toast.success('OTP sent to your email. Please verify.')
            setMode('verify_otp')
          }
        }

      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            toast.error('Invalid credentials. If you created your account using Google or Amazon, please use those buttons.')
          } else {
            toast.error(error.message)
          }
        } else {
          toast.success('Signed in successfully!')
          router.push('/')
        }
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error('Please enter the OTP')
      return
    }
    setIsLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup'
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    } else {
      toast.success('Email verified successfully! You are now logged in.')
      router.push('/')
    }
  }

  const handleOAuth = async (provider: 'google' | 'amazon' | any) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    })
    if (error) toast.error(error.message)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center pt-8 font-sans">
      {/* Logo */}
      <Link href="/" className="mb-6 mt-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon"
          className="w-[103px] h-[31px] object-contain"
        />
      </Link>

      <div className="w-full max-w-[350px] bg-white border border-[#ddd] rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.1)] mb-4 transition-all relative overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#f0c14b] animate-spin"></div>
          </div>
        )}

        <h1 className="text-[28px] font-normal mb-4">
          {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Verify Email'}
        </h1>

        {mode === 'verify_otp' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-[#a6a6a6] rounded shadow-inner py-1 px-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded text-sm py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] active:from-[#f0c14b] active:to-[#f0c14b] hover:bg-gradient-to-b hover:from-[#f5d78e] hover:to-[#eeb933]"
            >
              Verify & Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualAction} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-bold mb-1">Your name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="First and last name"
                  className="w-full border border-[#a6a6a6] rounded shadow-inner py-1 px-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-1">Email or mobile phone number</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#a6a6a6] rounded shadow-inner py-1 px-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 flex justify-between">
                Password
                {mode === 'signin' && <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer font-normal text-xs">Forgot your password?</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
                className="w-full border border-[#a6a6a6] rounded shadow-inner py-1 px-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] outline-none transition"
              />
              {mode === 'signup' && <p className="text-xs text-black mt-1">Passwords must be at least 6 characters.</p>}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-bold mb-1">Re-enter password</label>
                <input
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  className="w-full border border-[#a6a6a6] rounded shadow-inner py-1 px-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded text-sm py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] active:from-[#f0c14b] active:to-[#f0c14b] hover:bg-gradient-to-b hover:from-[#f5d78e] hover:to-[#eeb933] transition"
            >
              {mode === 'signin' ? 'Continue' : 'Verify email'}
            </button>

            <div className="text-xs text-black mt-4">
              By continuing, you agree to Amazon's <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>.
            </div>

            {/* Social Oauth Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-[13px] text-gray-600 mb-3 text-center">Or continue with</p>

              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded shadow-sm py-1.5 hover:bg-gray-50 mb-2 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                <span className="text-sm font-medium">Google</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Toggle between Signup and Signin */}
      {mode !== 'verify_otp' && (
        <div className="w-full max-w-[350px] flex flex-col items-center">
          <div className="flex w-full items-center mb-3 text-gray-500 text-[13px]">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3">{mode === 'signin' ? 'New to Amazon?' : 'Already have an account?'}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full bg-[#f1f1f1] border border-gray-300 rounded shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] py-1.5 text-sm hover:bg-[#e3e3e3] transition active:ring ring-[#008296] ring-offset-1 ring-offset-white ring-2"
          >
            {mode === 'signin' ? 'Create your Amazon account' : 'Sign in'}
          </button>
        </div>
      )}

    </div>
  )
}
