import { Trees } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import SocialAuth from '../components/SocialAuth';
import supabase from '../utils/supabaseClient';

async function LoginPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left space-y-6 p-6">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Trees className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">Treelink</h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back!
          </h2>
          <p className="text-gray-600 text-lg">
            Your digital forest of connections awaits.
          </p>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=500"
              alt="Nature"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthForm mode="login" />
          <SocialAuth />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;