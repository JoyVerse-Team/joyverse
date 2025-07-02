import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({}); // For multiple loading states
  const router = useRouter();

  // Single loading state
  const withLoading = async (asyncFunction, delay = 500) => {
    setLoading(true);
    try {
      // Add minimum delay to show animation
      const [result] = await Promise.all([
        asyncFunction(),
        new Promise(resolve => setTimeout(resolve, delay))
      ]);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Multiple loading states by key
  const withLoadingState = async (key, asyncFunction, delay = 500) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
      const [result] = await Promise.all([
        asyncFunction(),
        new Promise(resolve => setTimeout(resolve, delay))
      ]);
      return result;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  // Navigation with loading
  const navigateWithLoading = async (path, delay = 800) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    router.push(path);
    // Note: loading will be reset when component unmounts
  };
  // Navigation with specific loading state
  const navigateWithLoadingState = async (key, path, delay = 800) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, delay));
      router.push(path);
    } finally {
      // Reset loading state after navigation
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }, 100);
    }
  };

  return {
    loading,
    loadingStates,
    withLoading,
    withLoadingState,
    navigateWithLoading,
    navigateWithLoadingState,
    setLoading,
    isLoading: (key) => key ? loadingStates[key] : loading
  };
};
