
"use client";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAppContext } from '@/contexts/AppContext';
import type { SiteSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const settingsSchema = z.object({
  adSenseHeader: z.string().optional(),
  adSenseFooter: z.string().optional(),
  adSenseSidebar: z.string().optional(),
  customHeaderCode: z.string().optional(),
  customFooterCode: z.string().optional(),
  googleVerification: z.string().optional(),
  bingVerification: z.string().optional(),
  pinterestVerification: z.string().optional(),
  yandexVerification: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { siteSettings, updateSiteSettings } = useAppContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: siteSettings,
  });

  const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      updateSiteSettings(data);
      toast({ title: 'Settings Updated', description: 'Your site settings have been successfully updated.' });
    } catch (error) {
       toast({ title: 'Error', description: 'Failed to update settings. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Manage various site-wide settings, including ad codes and verification meta tags. These settings are typically injected into your site's HTML.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['ads', 'verification', 'custom-code']} className="w-full">
            <AccordionItem value="ads">
              <AccordionTrigger className="text-lg font-semibold">Ad Code Insertion</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="adSenseHeader" className="mb-1.5">AdSense Code (Header)</Label>
                  <Textarea id="adSenseHeader" {...register('adSenseHeader')} placeholder="Paste your AdSense header code here" rows={3} />
                  <p className="text-xs text-muted-foreground mt-1">Code to be inserted in the &lt;head&gt; section.</p>
                </div>
                <div>
                  <Label htmlFor="adSenseFooter" className="mb-1.5">AdSense Code (Footer)</Label>
                  <Textarea id="adSenseFooter" {...register('adSenseFooter')} placeholder="Paste your AdSense footer code here (e.g., before </body>)" rows={3} />
                   <p className="text-xs text-muted-foreground mt-1">Code to be inserted before the closing &lt;/body&gt; tag.</p>
                </div>
                <div>
                  <Label htmlFor="adSenseSidebar" className="mb-1.5">AdSense Code (Sidebar/In-article)</Label>
                  <Textarea id="adSenseSidebar" {...register('adSenseSidebar')} placeholder="Paste your AdSense code for sidebar or in-article ads" rows={3} />
                  <p className="text-xs text-muted-foreground mt-1">This code can be manually placed in theme templates or widgets.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-code">
              <AccordionTrigger className="text-lg font-semibold">Custom Code Insertion</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                 <div>
                  <Label htmlFor="customHeaderCode" className="mb-1.5">Custom Header Code</Label>
                  <Textarea id="customHeaderCode" {...register('customHeaderCode')} placeholder="Any other code for the <head> section (e.g., analytics, custom scripts)" rows={4} />
                   <p className="text-xs text-muted-foreground mt-1">Inserted in the &lt;head&gt; section.</p>
                </div>
                <div>
                  <Label htmlFor="customFooterCode" className="mb-1.5">Custom Footer Code</Label>
                  <Textarea id="customFooterCode" {...register('customFooterCode')} placeholder="Any other code before </body> (e.g., tracking pixels, chat widgets)" rows={4} />
                  <p className="text-xs text-muted-foreground mt-1">Inserted before the closing &lt;/body&gt; tag.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="verification">
              <AccordionTrigger className="text-lg font-semibold">Site Verification Codes</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="googleVerification" className="mb-1.5">Google Search Console</Label>
                  <Input id="googleVerification" {...register('googleVerification')} placeholder="Paste Google verification meta tag content or ID" />
                  <p className="text-xs text-muted-foreground mt-1">e.g., content value of &lt;meta name="google-site-verification" content="..." /&gt;</p>
                </div>
                <div>
                  <Label htmlFor="bingVerification" className="mb-1.5">Bing Webmaster Tools</Label>
                  <Input id="bingVerification" {...register('bingVerification')} placeholder="Paste Bing verification meta tag content or ID" />
                </div>
                <div>
                  <Label htmlFor="pinterestVerification" className="mb-1.5">Pinterest Verification</Label>
                  <Input id="pinterestVerification" {...register('pinterestVerification')} placeholder="Paste Pinterest verification meta tag content or ID" />
                </div>
                <div>
                  <Label htmlFor="yandexVerification" className="mb-1.5">Yandex Webmaster</Label>
                  <Input id="yandexVerification" {...register('yandexVerification')} placeholder="Paste Yandex verification meta tag content or ID" />
                </div>
                 <p className="text-sm text-muted-foreground mt-2">These codes are typically inserted as meta tags in the &lt;head&gt; section of your site for verification purposes.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </form>
  );
}
