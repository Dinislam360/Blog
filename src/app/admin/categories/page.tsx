
"use client";
import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryForm } from '@/components/admin/CategoryForm';
import type { Category } from '@/types';
import { Edit3, Trash2, PlusCircle, Tags } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
// Note: Deleting categories is not implemented in mock AppContext for simplicity.

export default function AdminCategoriesPage() {
  const { categories } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const { toast } = useToast();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
  };
  
  const handleDelete = (categoryId: string) => {
    // In a real app, check if category is in use, then call API to delete.
    console.log("Attempting to delete category (mock):", categoryId);
    toast({
      title: "Delete Action (Mock)",
      description: `Category deletion for ID ${categoryId} is not fully implemented in this mock setup.`,
      variant: "default"
    });
  };


  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <CategoryForm category={editingCategory} onFormSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>View, edit, or delete your post categories.</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  // Mock post count
                  const postCount = useAppContext().posts.filter(p => p.categoryId === category.id).length;
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>/categories/{category.slug}</TableCell>
                      <TableCell>{postCount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} title="Edit Category">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" title="Delete Category" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category.
                                (Note: Deletion is mocked in this demo.)
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Tags className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground mb-4">Organize your posts by creating categories.</p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
