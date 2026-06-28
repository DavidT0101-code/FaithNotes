-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (auto-created on signup)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sermons
create table public.sermons (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  source_type text check (source_type in ('audio', 'video', 'youtube')) not null,
  source_url text,
  file_path text,
  transcript text,
  summary text not null,
  main_points jsonb default '[]'::jsonb,
  key_takeaways jsonb default '[]'::jsonb,
  action_steps jsonb default '[]'::jsonb,
  bible_verses jsonb default '[]'::jsonb,
  thumbnail_url text,
  is_public boolean default false,
  created_at timestamptz default now()
);

alter table public.sermons enable row level security;
create policy "Users can view own sermons" on public.sermons for select using (auth.uid() = user_id);
create policy "Users can view public sermons" on public.sermons for select using (is_public = true);
create policy "Users can insert own sermons" on public.sermons for insert with check (auth.uid() = user_id);
create policy "Users can update own sermons" on public.sermons for update using (auth.uid() = user_id);
create policy "Users can delete own sermons" on public.sermons for delete using (auth.uid() = user_id);

-- Devotions
create table public.devotions (
  id uuid default uuid_generate_v4() primary key,
  sermon_id uuid references public.sermons(id) on delete cascade not null,
  day integer check (day between 1 and 6) not null,
  theme text not null,
  reflection text not null,
  challenge text not null,
  verse jsonb not null,
  prayer_focus text not null,
  created_at timestamptz default now()
);

alter table public.devotions enable row level security;
create policy "Anyone can view devotions for accessible sermons" on public.devotions
  for select using (
    exists (
      select 1 from public.sermons s
      where s.id = sermon_id and (s.user_id = auth.uid() or s.is_public)
    )
  );
create policy "Users can insert devotions for own sermons" on public.devotions
  for insert with check (
    exists (select 1 from public.sermons s where s.id = sermon_id and s.user_id = auth.uid())
  );

-- Quiz Questions
create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  sermon_id uuid references public.sermons(id) on delete cascade not null,
  question text not null,
  options jsonb not null,
  correct_index integer not null,
  explanation text not null,
  created_at timestamptz default now()
);

alter table public.quiz_questions enable row level security;
create policy "Anyone can view quiz for accessible sermons" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.sermons s
      where s.id = sermon_id and (s.user_id = auth.uid() or s.is_public)
    )
  );
create policy "Users can insert quiz for own sermons" on public.quiz_questions
  for insert with check (
    exists (select 1 from public.sermons s where s.id = sermon_id and s.user_id = auth.uid())
  );

-- Quiz Results
create table public.quiz_results (
  id uuid default uuid_generate_v4() primary key,
  sermon_id uuid references public.sermons(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null,
  total integer not null,
  completed_at timestamptz default now()
);

alter table public.quiz_results enable row level security;
create policy "Users can view own quiz results" on public.quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert own quiz results" on public.quiz_results for insert with check (auth.uid() = user_id);

-- Friend Requests
create table public.friend_requests (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'declined')) default 'pending',
  created_at timestamptz default now(),
  unique (sender_id, receiver_id)
);

alter table public.friend_requests enable row level security;
create policy "Users can view own friend requests" on public.friend_requests
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send friend requests" on public.friend_requests
  for insert with check (auth.uid() = sender_id);
create policy "Receivers can update friend requests" on public.friend_requests
  for update using (auth.uid() = receiver_id);

-- Storage bucket for sermon files
insert into storage.buckets (id, name, public) values ('sermons', 'sermons', false);

create policy "Users can upload their own sermons" on storage.objects
  for insert with check (bucket_id = 'sermons' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can view their own sermon files" on storage.objects
  for select using (bucket_id = 'sermons' and auth.uid()::text = (storage.foldername(name))[1]);
