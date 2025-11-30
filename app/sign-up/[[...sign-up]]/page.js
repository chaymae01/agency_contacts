import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ContactHub
              </h1>
            </div>
          </Link>
          <p className="text-gray-300 text-lg">
            Create your account
          </p>
          <p className="text-gray-400 mt-2">
            Join us to start managing your contacts
          </p>
        </div>

        {/* SignUp Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none w-full bg-transparent",
                headerTitle: "text-2xl font-bold text-white text-center",
                headerSubtitle: "text-gray-300 text-center",
                socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200",
                socialButtonsBlockButtonText: "text-white",
                formFieldLabel: "text-white font-medium",
                formFieldInput: "bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200",
                formButtonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl",
                footerActionLink: "text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200",
                footer: "border-t border-white/10",
                formFieldAction: "text-purple-300 hover:text-purple-200",
                identityPreview: "bg-white/5 border border-white/20",
                identityPreviewText: "text-white"
              }
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
          />
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/sign-in" 
              className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}