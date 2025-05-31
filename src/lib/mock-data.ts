import type { Post, Category, SiteSettings } from '@/types';
import { generateSlug } from './utils';

// Using static ISO strings for consistent timestamps across server/client
const staticDate1 = "2024-05-27T10:00:00.000Z";
const staticDate2 = "2024-05-28T10:00:00.000Z";
const staticDate3 = "2024-05-29T10:00:00.000Z";
const staticDate4 = "2024-05-30T10:00:00.000Z"; // Newest


export const mockCategories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Travel', slug: 'travel' },
  { id: '3', name: 'Lifestyle', slug: 'lifestyle' },
];

export const mockPosts: Post[] = [
   {
    id: '4',
    title: 'Understanding Blockchain Technology Beyond Bitcoin',
    slug: generateSlug('Understanding Blockchain Technology Beyond Bitcoin'),
    content: '<p>While Bitcoin brought blockchain to mainstream attention, the underlying technology has far-reaching applications beyond cryptocurrencies.</p><p>This post explains the fundamentals of blockchain, its key features like decentralization and immutability, and explores its potential use cases in various industries such as finance, healthcare, and supply chain management.</p>',
    featuredImage: 'https://cdn.articlesfactory.com/cdn/img/mediaimage.webp', // Using a different domain for testing
    dataAiHint: 'blockchain network',
    categoryId: '1',
    seoKeywords: 'Blockchain, Technology, Cryptocurrency, Decentralization, Innovation',
    seoDescription: 'An in-depth look at blockchain technology, its core concepts, and its diverse applications beyond Bitcoin and cryptocurrencies.',
    createdAt: staticDate4,
    updatedAt: staticDate4,
  },
  {
    id: '3',
    title: 'Minimalist Living: A Guide to Decluttering Your Life',
    slug: generateSlug('Minimalist Living A Guide to Decluttering Your Life'),
    content: '<p>Minimalism is more than just an aesthetic; it\'s a lifestyle choice that can lead to greater peace and clarity.</p><p>This guide provides practical steps to declutter your physical space, digital life, and even your mind. Learn the benefits of minimalist living and how to get started on your journey towards a simpler, more intentional life.</p>',
    featuredImage: 'https://placehold.co/800x400.png',
    dataAiHint: 'minimalist interior',
    categoryId: '3',
    seoKeywords: 'Minimalism, Lifestyle, Decluttering, Simple Living',
    seoDescription: 'A comprehensive guide to minimalist living, offering practical tips for decluttering your life and embracing simplicity.',
    createdAt: staticDate3,
    updatedAt: staticDate3,
  },
  {
    id: '2',
    title: 'Top 10 Must-Visit Destinations in Southeast Asia',
    slug: generateSlug('Top 10 Must-Visit Destinations in Southeast Asia'),
    content: '<p>Southeast Asia offers a diverse range of experiences for every traveler. From bustling cities to serene beaches, ancient temples to lush rainforests, there is something for everyone.</p><p>This guide highlights the top 10 destinations you absolutely must visit on your next adventure. Discover hidden gems, cultural hotspots, and practical travel tips.</p>',
    featuredImage: 'https://placehold.co/800x400.png',
    dataAiHint: 'travel asia',
    categoryId: '2',
    seoKeywords: 'Travel, Southeast Asia, Destinations, Adventure, Tourism',
    seoDescription: 'Discover the top 10 must-visit destinations in Southeast Asia, complete with travel tips and cultural insights.',
    createdAt: staticDate2,
    updatedAt: staticDate2,
  },
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    slug: generateSlug('The Future of AI in Web Development'),
    content: '<p>Artificial Intelligence is rapidly changing the landscape of web development. From automated testing to AI-powered code generation, the possibilities are endless.</p><p>This post explores the current trends and future potential of AI in this exciting field. We delve into machine learning models, natural language processing, and how these technologies are being integrated into modern development workflows.</p>',
    featuredImage: 'https://placehold.co/800x400.png',
    dataAiHint: 'technology abstract',
    categoryId: '1',
    seoKeywords: 'AI, Web Development, Future Tech, Machine Learning',
    seoDescription: 'Explore the future of AI in web development, including current trends, tools, and potential impacts on the industry.',
    createdAt: staticDate1,
    updatedAt: staticDate1,
  }
];

export const mockSiteSettings: SiteSettings = {
  siteTitle: 'Apex Blogs',
  logoUrl: '', // Default to empty, so Feather icon shows
  faviconUrl: '/favicon.ico', // Default favicon path
  footerCopyright: `© ${new Date().getFullYear()} Apex Blogs. All rights reserved.`,
  footerTagline: 'Powered by Next.js & ShadCN UI',
  socialLinks: [
    { id: '1', platform: 'Twitter', url: 'https://twitter.com/yourprofile' },
    { id: '2', platform: 'GitHub', url: 'https://github.com/yourprofile' },
  ],
  adSenseHeader: '',
  adSenseFooter: '',
  adSenseSidebar: '',
  customHeaderCode: '<!-- Custom header code here -->',
  customFooterCode: '<!-- Custom footer code here -->',
  googleVerification: '',
  bingVerification: '',
  pinterestVerification: '',
  yandexVerification: '',
};
