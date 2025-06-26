'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Chrome, Facebook, Github, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const { auth, login } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setLoadingProvider(provider);
    await login(provider);
    setLoadingProvider(null);
  };

  const providers = [
    { name: 'google', label: 'Continue with Google', icon: Chrome },
    { name: 'facebook', label: 'Continue with Facebook', icon: Facebook },
    { name: 'github', label: 'Continue with GitHub', icon: Github },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center poker-felt">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gold-accent bg-clip-text text-transparent">
            PokerPro
          </CardTitle>
          <CardDescription>
            Sign in to manage and join poker tournaments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers.map(({ name, label, icon: Icon }) => (
            <Button
              key={name}
              variant="outline"
              className="w-full h-12"
              onClick={() => handleLogin(name)}
              disabled={auth.isLoading}
            >
              {loadingProvider === name ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icon className="mr-2 h-4 w-4" />
              )}
              {label}
            </Button>
          ))}
          
          {auth.error && (
            <div className="text-sm text-destructive text-center">
              {auth.error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}