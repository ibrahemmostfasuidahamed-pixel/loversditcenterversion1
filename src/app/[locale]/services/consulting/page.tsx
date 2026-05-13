import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'AI Wellness Consultation | Lovers Diet Center',
  description: 'Build your personalized AI-powered weight loss and transformation plan',
};

export default function ConsultingPage() {
  redirect('/onboarding/gender');
}
