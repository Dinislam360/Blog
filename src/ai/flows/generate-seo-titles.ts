
'use server';
/**
 * @fileOverview AI-powered SEO title, heading, description, and keyword generator for blog posts.
 *
 * - generateSEOTitles - A function that generates alternative titles, headings, SEO description, and SEO keywords for a blog post.
 * - GenerateSEOTitlesInput - The input type for the generateSEOTitles function.
 * - GenerateSEOTitlesOutput - The return type for the generateSEOTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSEOTitlesInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the blog post to generate titles, headings, description, and keywords for.'),
});
export type GenerateSEOTitlesInput = z.infer<typeof GenerateSEOTitlesInputSchema>;

const GenerateSEOTitlesOutputSchema = z.object({
  alternativeTitles: z
    .array(z.string())
    .describe('Alternative titles for the blog post, optimized for SEO.'),
  alternativeHeadings: z
    .array(z.string())
    .describe('Alternative headings for the blog post, optimized for SEO.'),
  suggestedSEODescription: z
    .string()
    .describe('A suggested SEO meta description for the blog post (around 150-160 characters).'),
  suggestedSEOKeywords: z
    .array(z.string())
    .describe('A list of suggested SEO keywords for the blog post (around 5-7 keywords).'),
});
export type GenerateSEOTitlesOutput = z.infer<typeof GenerateSEOTitlesOutputSchema>;

export async function generateSEOTitles(input: GenerateSEOTitlesInput): Promise<GenerateSEOTitlesOutput> {
  return generateSEOTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSEOTitlesPrompt',
  input: {schema: GenerateSEOTitlesInputSchema},
  output: {schema: GenerateSEOTitlesOutputSchema},
  prompt: `You are an SEO expert specializing in creating engaging and high-ranking blog post titles, headings, SEO descriptions, and keywords.

Based on the content of the blog post provided, generate:
1. Alternative titles (at least 3) that are optimized for search engines and will attract more readers.
2. Alternative headings (at least 5) that are optimized for SEO and readability within the post.
3. A concise and compelling SEO meta description (around 150-160 characters).
4. A list of relevant SEO keywords (around 5-7 keywords).

Blog Post Content:
{{content}}

Ensure your output strictly follows this structure:
Alternative Titles:
- Title 1
- Title 2
- Title 3

Alternative Headings:
- Heading 1
- Heading 2
- Heading 3
- Heading 4
- Heading 5

Suggested SEO Description:
[Generated SEO Description]

Suggested SEO Keywords:
- Keyword 1
- Keyword 2
- Keyword 3
- Keyword 4
- Keyword 5`,
});

const generateSEOTitlesFlow = ai.defineFlow(
  {
    name: 'generateSEOTitlesFlow',
    inputSchema: GenerateSEOTitlesInputSchema,
    outputSchema: GenerateSEOTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate SEO suggestions.");
    }
    // Ensure defaults if parts are missing, though the schema should enforce structure
    return {
        alternativeTitles: output.alternativeTitles || [],
        alternativeHeadings: output.alternativeHeadings || [],
        suggestedSEODescription: output.suggestedSEODescription || "",
        suggestedSEOKeywords: output.suggestedSEOKeywords || [],
    };
  }
);

