import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const checks = [];

    // 1. Check Firebase
    try {
      await adminAuth.listUsers(1); // Test Firebase connection
      checks.push({ name: 'Firebase', status: 'ok' });
    } catch (error) {
      checks.push({ name: 'Firebase', status: 'error', message: error.message });
    }

    // 2. Check Stripe
    try {
      await stripe.balance.retrieve();
      checks.push({ name: 'Stripe', status: 'ok' });
    } catch (error) {
      checks.push({ name: 'Stripe', status: 'error', message: error.message });
    }

    // 3. Check Environment Variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'GMAIL_USER',
      'GMAIL_APP_PASSWORD'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length === 0) {
      checks.push({ name: 'Environment Variables', status: 'ok' });
    } else {
      checks.push({
        name: 'Environment Variables',
        status: 'warning',
        message: `Missing: ${missingVars.join(', ')}`
      });
    }

    // 4. Check Email Configuration
    const emailConfigured = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;
    checks.push({
      name: 'Email Service',
      status: emailConfigured ? 'ok' : 'warning',
      message: emailConfigured ? 'Configured' : 'Not configured'
    });

    const allOk = checks.every(check => check.status === 'ok');

    return NextResponse.json({
      status: allOk ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        checks: [],
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
}
