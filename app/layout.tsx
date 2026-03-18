import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tech Stack Builder — Find the right tools for your business',
  description:
    'Answer a few questions about your business and get personalised recommendations for every layer of your marketing and data technology stack.',
  openGraph: {
    title: 'Tech Stack Builder',
    description: 'Get personalised tech stack recommendations in minutes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
