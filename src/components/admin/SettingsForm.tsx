
"use client";
import { useForm, type SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAppContext } from '@/contexts/AppContext';
import type { SiteSettings, SocialLink } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Must be a valid URL"),
});

const settingsSchema = z.object({
  siteTitle: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  faviconUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  adminSidebarLogoColor: z.string().optional(),
  footerCopyright: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
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

const sidebarLogoColorOptions = [
  { label: "Default (Theme Defined)", value: "use-theme-default" },
  { label: "Sidebar Text Color", value: "text-sidebar-foreground" },
  { label: "Sidebar Primary Color", value: "text-sidebar-primary" },
  { label: "Sidebar Primary Text", value: "text-sidebar-primary-foreground" },
  { label: "Sidebar Accent Color", value: "text-sidebar-accent" },
  { label: "Sidebar Accent Text", value: "text-sidebar-accent-foreground" },
  { label: "White", value: "text-white" },
  { label: "Black", value: "text-black" },
  { label: "Light Gray (Slate 400)", value: "text-slate-400" },
  { label: "Dark Gray (Slate 600)", value: "text-slate-600" },
];

export function SettingsForm() {
  const { siteSettings, updateSiteSettings, isInitialDataLoaded } = useAppContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: siteSettings, 
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  useEffect(() => {
    if (isInitialDataLoaded) {
      reset(siteSettings);
    }
  }, [siteSettings, isInitialDataLoaded, reset]);


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
  
  const addNewSocialLink = () => {
    append({ id: Date.now().toString(), platform: '', url: '' });
  };

  if (!isInitialDataLoaded) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
          </CardContent>
        </Card>
         <div className="flex justify-end">
            <div className="h-10 w-24 bg-primary rounded animate-pulse"></div>
        </div>
      </div>
    );
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Manage various site-wide settings. These settings are typically injected into your site's HTML or used by components.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['identity', 'footer', 'social', 'ads', 'verification', 'custom-code']} className="w-full">
            
            <AccordionItem value="identity">
              <AccordionTrigger className="text-lg font-semibold">Site Identity & Appearance</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="siteTitle" className="mb-1.5 block">Site Title</Label>
                  <Input id="siteTitle" {...register('siteTitle')} placeholder="Your Awesome Blog Name" />
                  {errors.siteTitle && <p className="text-sm text-destructive mt-1">{errors.siteTitle.message}</p>}
                </div>
                <div>
                  <Label htmlFor="logoUrl" className="mb-1.5 block">Logo URL</Label>
                  <Input id="logoUrl" {...register('logoUrl')} placeholder="https://example.com/logo.png" />
                  {errors.logoUrl && <p className="text-sm text-destructive mt-1">{errors.logoUrl.message}</p>}
                   <p className="text-xs text-muted-foreground mt-1">Leave blank to use default icon and site title text.</p>
                </div>
                <div>
                  <Label htmlFor="faviconUrl" className="mb-1.5 block">Favicon URL</Label>
                  <Input id="faviconUrl" {...register('faviconUrl')} placeholder="/favicon.ico or https://example.com/favicon.png" />
                  {errors.faviconUrl && <p className="text-sm text-destructive mt-1">{errors.faviconUrl.message}</p>}
                </div>
                <div>
                  <Label htmlFor="adminSidebarLogoColor" className="mb-1.5 block">Admin Sidebar Logo Color</Label>
                  <Controller
                    name="adminSidebarLogoColor"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(selectedValue) => field.onChange(selectedValue === "use-theme-default" ? "" : selectedValue)}
                        value={field.value === "" || field.value === undefined ? "use-theme-default" : field.value}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={errors.adminSidebarLogoColor ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                        <SelectContent>
                          {sidebarLogoColorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.adminSidebarLogoColor && <p className="text-sm text-destructive mt-1">{errors.adminSidebarLogoColor.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Choose a color for the logo in the admin sidebar. "Default" uses the theme-defined color.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="footer">
              <AccordionTrigger className="text-lg font-semibold">Footer Configuration</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="footerCopyright" className="mb-1.5 block">Footer Copyright Text</Label>
                  <Input id="footerCopyright" {...register('footerCopyright')} placeholder={`© ${new Date().getFullYear()} Your Site Name`} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="social">
              <AccordionTrigger className="text-lg font-semibold">Social Media Links</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-end gap-3 p-3 border rounded-md bg-muted/30 relative">
                     <GripVertical className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-grab" />
                    <div className="flex-1 pl-4">
                      <Label htmlFor={`socialLinks.${index}.platform`} className="mb-1.5 block text-xs">Platform</Label>
                      <Input
                        id={`socialLinks.${index}.platform`}
                        {...register(`socialLinks.${index}.platform`)}
                        placeholder="e.g., Twitter, GitHub"
                        className="mb-2"
                      />
                      {errors.socialLinks?.[index]?.platform && <p className="text-sm text-destructive mb-1">{errors.socialLinks[index]?.platform?.message}</p>}
                      
                      <Label htmlFor={`socialLinks.${index}.url`} className="mb-1.5 block text-xs">URL</Label>
                      <Input
                        id={`socialLinks.${index}.url`}
                        {...register(`socialLinks.${index}.url`)}
                        placeholder="https://twitter.com/username"
                      />
                      {errors.socialLinks?.[index]?.url && <p className="text-sm text-destructive mt-1">{errors.socialLinks[index]?.url?.message}</p>}
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive/80" title="Delete social link">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addNewSocialLink} className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ads">
              <AccordionTrigger className="text-lg font-semibold">Ad Code Insertion</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="adSenseHeader" className="mb-1.5 block">AdSense Code (Header)</Label>
                  <Textarea id="adSenseHeader" {...register('adSenseHeader')} placeholder="Paste your AdSense header code here" rows={3} />
                  <p className="text-xs text-muted-foreground mt-1">Code to be inserted in the &lt;head&gt; section.</p>
                </div>
                <div>
                  <Label htmlFor="adSenseFooter" className="mb-1.5 block">AdSense Code (Footer)</Label>
                  <Textarea id="adSenseFooter" {...register('adSenseFooter')} placeholder="Paste your AdSense footer code here (e.g., before </body>)" rows={3} />
                   <p className="text-xs text-muted-foreground mt-1">Code to be inserted before the closing &lt;/body&gt; tag.</p>
                </div>
                <div>
                  <Label htmlFor="adSenseSidebar" className="mb-1.5 block">AdSense Code (Sidebar/In-article)</Label>
                  <Textarea id="adSenseSidebar" {...register('adSenseSidebar')} placeholder="Paste your AdSense code for sidebar or in-article ads" rows={3} />
                  <p className="text-xs text-muted-foreground mt-1">This code can be manually placed in theme templates or widgets.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-code">
              <AccordionTrigger className="text-lg font-semibold">Custom Code Insertion</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                 <div>
                  <Label htmlFor="customHeaderCode" className="mb-1.5 block">Custom Header Code</Label>
                  <Textarea id="customHeaderCode" {...register('customHeaderCode')} placeholder="Any other code for the <head> section (e.g., analytics, custom scripts)" rows={4} />
                   <p className="text-xs text-muted-foreground mt-1">Inserted in the &lt;head&gt; section.</p>
                </div>
                <div>
                  <Label htmlFor="customFooterCode" className="mb-1.5 block">Custom Footer Code</Label>
                  <Textarea id="customFooterCode" {...register('customFooterCode')} placeholder="Any other code before </body> (e.g., tracking pixels, chat widgets)" rows={4} />
                  <p className="text-xs text-muted-foreground mt-1">Inserted before the closing &lt;/body&gt; tag.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="verification">
              <AccordionTrigger className="text-lg font-semibold">Site Verification Codes</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="googleVerification" className="mb-1.5 block">Google Search Console</Label>
                  <Input id="googleVerification" {...register('googleVerification')} placeholder="Paste content attribute of meta tag" />
                  <p className="text-xs text-muted-foreground mt-1">Enter the value of the `content` attribute from Google's meta tag.</p>
                </div>
                <div>
                  <Label htmlFor="bingVerification" className="mb-1.5 block">Bing Webmaster Tools</Label>
                  <Input id="bingVerification" {...register('bingVerification')} placeholder="Paste content attribute of meta tag" />
                   <p className="text-xs text-muted-foreground mt-1">Enter the value of the `content` attribute from Bing's meta tag (msvalidate.01).</p>
                </div>
                <div>
                  <Label htmlFor="pinterestVerification" className="mb-1.5 block">Pinterest Verification</Label>
                  <Input id="pinterestVerification" {...register('pinterestVerification')} placeholder="Paste content attribute of meta tag" />
                   <p className="text-xs text-muted-foreground mt-1">Enter the value of the `content` attribute from Pinterest's meta tag (p:domain_verify).</p>
                </div>
                <div>
                  <Label htmlFor="yandexVerification" className="mb-1.5 block">Yandex Webmaster</Label>
                  <Input id="yandexVerification" {...register('yandexVerification')} placeholder="Paste content attribute of meta tag" />
                  <p className="text-xs text-muted-foreground mt-1">Enter the value of the `content` attribute from Yandex's meta tag.</p>
                </div>
                 <p className="text-sm text-muted-foreground mt-2">These codes will be inserted as meta tags in the &lt;head&gt; section of your site.</p>
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
