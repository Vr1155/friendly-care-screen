-- Create caregivers table
CREATE TABLE public.caregivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own caregivers" 
ON public.caregivers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own caregivers" 
ON public.caregivers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own caregivers" 
ON public.caregivers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own caregivers" 
ON public.caregivers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_caregivers_updated_at
BEFORE UPDATE ON public.caregivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();