'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useInvestorStore } from '@/lib/investorStore';
import { UserCircle, TrendingUp } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setCurrentUser } = useInvestorStore();
  const [selectedRole, setSelectedRole] = useState<'founder' | 'investor' | null>(null);

  const handleRoleSelect = (role: 'founder' | 'investor') => {
    if (role === 'founder') {
      setCurrentUser({
        id: 'founder-1',
        name: 'Sarah Chen',
        email: 'sarah@startup.com',
        role: 'founder',
      });
      router.push('/home-founder');
    } else {
      setCurrentUser({
        id: 'investor-1',
        name: 'Alex Thompson',
        email: 'alex@venture.com',
        role: 'investor',
      });
      router.push('/home-investor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold mb-4">Welcome to Colossify</h1>
          <p className="text-xl text-muted">
            Choose your role to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          {/* Founder Card */}
          <Card
            className={`p-8 cursor-pointer transition-all ${selectedRole === 'founder' ? 'ring-2 ring-accent' : ''
              }`}
            onClick={() => setSelectedRole('founder')}
          >
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">I'm a Founder</h2>
                <p className="text-muted">
                  Submit your startup ideas, get validation, and connect with investors
                </p>
              </div>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Submit and validate ideas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Manage your projects
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Review investor proposals
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Track access requests
                </li>
              </ul>
              <Button
                onClick={() => handleRoleSelect('founder')}
                className="w-full"
                size="lg"
              >
                Continue as Founder
              </Button>
            </div>
          </Card>

          {/* Investor Card */}
          <Card
            className={`p-8 cursor-pointer transition-all ${selectedRole === 'investor' ? 'ring-2 ring-accent' : ''
              }`}
            onClick={() => setSelectedRole('investor')}
          >
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">I'm an Investor</h2>
                <p className="text-muted">
                  Discover promising startups, request access, and make investment proposals
                </p>
              </div>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Browse startup ideas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Request project access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Make investment proposals
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  Track your investments
                </li>
              </ul>
              <Button
                onClick={() => handleRoleSelect('investor')}
                className="w-full"
                size="lg"
              >
                Continue as Investor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
