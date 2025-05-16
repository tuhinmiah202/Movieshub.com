import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { format } from "date-fns";
import { Category, insertMovieSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputFile } from "@/components/ui/input-file";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = insertMovieSchema.extend({
  releaseDate: z.coerce.date(),
  isReleased: z.enum(["true", "false"]).transform(val => val === "true"),
});

type FormValues = z.infer<typeof formSchema>;

// Login form schema for admin password
const loginSchema = z.object({
  password: z.string().min(1, "Password is required")
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Admin() {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Form configuration
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      releaseDate: new Date(),
      isReleased: "true",
    }
  });
  
  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: ""
    }
  });
  
  // Handle login
  const handleLogin = (data: LoginValues) => {
    if (data.password === "tuhin@123") {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Admin access granted",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };
  
  // Handle image changes
  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // If this was a real app with Cloudinary, we'd upload the file
        // For now, just use the data URL as the image URL
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        form.setValue("imageUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Clear image
  const handleClearFile = () => {
    setPreviewUrl(null);
    form.setValue("imageUrl", "");
  };
  
  // Add movie mutation
  const addMovieMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/movies", data);
      return response.json();
    },
    onSuccess: () => {
      // Reset form
      form.reset({
        title: "",
        description: "",
        imageUrl: "",
        releaseDate: new Date(),
        isReleased: "true",
      });
      setPreviewUrl(null);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Movie added successfully",
        variant: "default",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/movies/status/true'] });
      queryClient.invalidateQueries({ queryKey: ['/api/movies/status/false'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add movie",
        variant: "destructive",
      });
    }
  });
  
  // Form submission
  const onSubmit = (data: FormValues) => {
    addMovieMutation.mutate(data);
  };
  
  return (
    <section id="admin" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {!isAuthenticated ? (
          // Login Form
          <div className="bg-secondary rounded-lg p-6 md:p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-montserrat font-bold text-white mb-6">Admin Login</h2>
            <p className="text-gray-300 mb-6">
              Please enter your password to access the admin panel.
            </p>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Enter your password" 
                          className="bg-neutral border-gray-600 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-accent hover:bg-accent/90 text-white w-full"
                >
                  Login
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          // Admin Panel (only shown after authentication)
          <div className="bg-secondary rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-montserrat font-bold text-white">Admin Panel</h2>
              <Button 
                variant="outline"
                className="text-accent border-accent hover:bg-accent hover:text-white"
                onClick={() => setIsAuthenticated(false)}
              >
                Logout
              </Button>
            </div>
            <p className="text-gray-300 mb-8">
              Add new movies and series to the database. All fields are required unless specified otherwise.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Movie/Series Title" 
                            className="bg-neutral border-gray-600 text-white" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Category</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-neutral border-gray-600 text-white">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral text-white">
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Release Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-neutral border-gray-600 text-white" 
                            {...field}
                            value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isReleased"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-gray-300">Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="true" 
                                id="statusReleased" 
                                className="text-accent" 
                              />
                              <label 
                                htmlFor="statusReleased" 
                                className="text-sm text-gray-300"
                              >
                                Released
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="false" 
                                id="statusUpcoming" 
                                className="text-accent" 
                              />
                              <label 
                                htmlFor="statusUpcoming" 
                                className="text-sm text-gray-300"
                              >
                                Upcoming
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          className="bg-neutral border-gray-600 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-gray-400 mt-1">
                        Enter a valid image URL or use the upload option below.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <InputFile
                  accept="image/*"
                  onFileChange={handleFileChange}
                  previewUrl={previewUrl}
                  onClearFile={handleClearFile}
                  helperText="Supports JPG, PNG, WebP. Max size: 5MB"
                  containerClassName="mt-4"
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter movie description..." 
                          className="bg-neutral border-gray-600 text-white" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-gray-600 hover:bg-gray-700 text-white mr-4"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-accent hover:bg-accent/90 text-white"
                    disabled={addMovieMutation.isPending}
                  >
                    {addMovieMutation.isPending ? "Adding..." : "Add Movie"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </section>
  );
}
