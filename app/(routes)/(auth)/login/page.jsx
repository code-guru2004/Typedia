"use client";
import EmailAuthForm from '@/components/EmailAuthForm';
import SocialLoginButtons from '@/components/SocialLoginButtons';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
                <p className="text-sm text-center text-gray-500">Sign in to your account</p>
                <EmailAuthForm />
                <SocialLoginButtons />

                <p className="text-xs text-gray-400 text-center mt-6">
                    By continuing, you agree to our <span className="text-blue-500">Terms</span> and <span className="text-blue-500">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
}
