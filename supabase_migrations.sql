create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, subscription_status)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;