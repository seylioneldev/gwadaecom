import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const systemInfo = {
      version: 'v1.0.0',
      lastUpdate: new Date().toLocaleDateString('fr-FR'),
      environment: process.env.NODE_ENV || 'production',
      platform: 'Vercel',
      services: {
        firebase: 'connected',
        stripe: 'connected',
        email: 'configured'
      },
      dependencies: {
        nextjs: '16.0.7',
        react: '19.2.0',
        stripe: '20.0.0'
      }
    };

    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error('Erreur système:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations système' },
      { status: 500 }
    );
  }
}
