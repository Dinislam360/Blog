'use server';
/**
 * @fileOverview AI-powered SEO title and heading generator for blog posts.
 *
 * - generateSEOTitles - A function that generates alternative titles and headings for a blog post.
 * - GenerateSEOTitlesInput - The input type for the generateSEOTitles function.
 * - GenerateSEOTitlesOutput - The return type for the generateSEOTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSEOTitlesInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the blog post to generate titles and headings for.'),
});
export type GenerateSEOTitlesInput = z.infer<typeof GenerateSEOTitlesInputSchema>;

const GenerateSEOTitlesOutputSchema = z.object({
  alternativeTitles: z
    .array(z.string())
    .describe('Alternative titles for the blog post, optimized for SEO.'),
  alternativeHeadings: z
    .array(z.string())
    .describe('Alternative headings for the blog post, optimized for SEO.'),
});
export type GenerateSEOTitlesOutput = z.infer<typeof GenerateSEOTitlesOutputSchema>;

export async function generateSEOTitles(input: GenerateSEOTitlesInput): Promise<GenerateSEOTitlesOutput> {
  return generateSEOTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSEOTitlesPrompt',
  input: {schema: GenerateSEOTitlesInputSchema},
  output: {schema: GenerateSEOTitlesOutputSchema},
  prompt: `You are an SEO expert specializing in creating engaging and high-ranking blog post titles and headings.

  Based on the content of the blog post provided, generate alternative titles and headings that are optimized for search engines and will attract more readers.

  Blog Post Content:
  {{content}}

  Alternative Titles (at least 3):
  - Title 1
  - Title 2
  - Title 3

  Alternative Headings (at least 5):
  - Heading 1
  - Heading 2
  - Heading 3
  - Heading 4
  - Heading 5`,
});

const generateSEOTitlesFlow = ai.defineFlow(
  {
    name: 'generateSEOTitlesFlow',
    inputSchema: GenerateSEOTitlesInputSchema,
    outputSchema: GenerateSEOTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
