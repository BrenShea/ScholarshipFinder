-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  age integer,
  graduation_year integer,
  is_transfer boolean default false,
  interests text[], -- Array of strings
  gemini_api_key text,
  updated_at timestamp with time zone default now(),
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
