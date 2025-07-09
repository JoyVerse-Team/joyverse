"use client"
import React from 'react';
import { useAuth } from '@/components/auth-provider';
import ProtectedRoute from '@/components/protected-route';
import BouncyLettersGame from '@/components/bouncy-letters/BouncyLettersGame';

export default function BouncyLettersPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <BouncyLettersGame />
    </ProtectedRoute>
  );
}
