-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  doctor_type TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own doctors" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doctors" 
ON public.doctors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doctors" 
ON public.doctors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own doctors" 
ON public.doctors 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for doctor photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('doctor-photos', 'doctor-photos', true);

-- Create storage policies for doctor photos
CREATE POLICY "Users can view doctor photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'doctor-photos');

CREATE POLICY "Users can upload their own doctor photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'doctor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own doctor photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'doctor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own doctor photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'doctor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);