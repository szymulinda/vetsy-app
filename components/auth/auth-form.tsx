"use client"

import { useState } from "react"
import { Chrome, Apple, Eye, EyeOff, Mail, Lock, Building2, User } from "lucide-react"

interface AuthFormProps {
  userType: "b2c" | "b2b"
  authMode: "login" | "register"
  login: (formData: FormData) => Promise<void>
  signupClient: (formData: FormData) => Promise<void>
  signupClinic: (formData: FormData) => Promise<void>
}

export function AuthForm({
  userType,
  authMode,
  login,
  signupClient,
  signupClinic,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [clinicName, setClinicName] = useState("")

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <Chrome className="w-5 h-5" />
          <span>Zaloguj przez Google</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          <Apple className="w-5 h-5" />
          <span>Zaloguj przez Apple</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">lub zaloguj e-mailem</span>
        </div>
      </div>

      <form
        action={
          authMode === "login"
            ? login
            : userType === "b2c"
              ? signupClient
              : signupClinic
        }
        className="space-y-4"
      >
        <input type="hidden" name="user_type" value={userType} />
        {authMode === "register" && (
          <div className="space-y-4">
            {userType === "b2b" && (
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="clinic_name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Nazwa gabinetu"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            )}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name={userType === "b2b" ? "owner_name" : "full_name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={userType === "b2b" ? "Imię i nazwisko właściciela" : "Imię i nazwisko"}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adres e-mail"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {authMode === "login" && (
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              Zapomniałeś hasła?
            </a>
          </div>
        )}

        {authMode === "register" && userType === "b2b" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-emerald-700 text-sm font-medium flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </span>
              30 dni bezpłatnego okresu próbnego
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
        >
          {authMode === "login" ? "Zaloguj się" : "Utwórz konto"}
        </button>
      </form>
    </div>
  )
}
