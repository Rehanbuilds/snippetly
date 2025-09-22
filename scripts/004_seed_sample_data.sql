-- Insert sample snippets for testing (only if no snippets exist)
DO $$
DECLARE
    user_count INTEGER;
    snippet_count INTEGER;
    sample_user_id UUID;
BEGIN
    -- Check if there are any users
    SELECT COUNT(*) INTO user_count FROM auth.users;
    
    -- Check if there are any snippets
    SELECT COUNT(*) INTO snippet_count FROM public.snippets;
    
    -- Only seed if there are users but no snippets
    IF user_count > 0 AND snippet_count = 0 THEN
        -- Get the first user ID
        SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
        
        -- Insert sample snippets
        INSERT INTO public.snippets (title, description, code, language, tags, is_favorite, user_id) VALUES
        (
            'useLocalStorage Hook',
            'Custom React hook for managing localStorage with state synchronization',
            'const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
};',
            'React',
            ARRAY['hooks', 'react', 'localStorage'],
            true,
            sample_user_id
        ),
        (
            'API Error Handler',
            'Centralized error handling utility for API responses',
            'const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 401:
        return ''Unauthorized access'';
      case 404:
        return ''Resource not found'';
      case 500:
        return ''Server error occurred'';
      default:
        return data.message || ''An error occurred'';
    }
  } else if (error.request) {
    return ''Network error - please check your connection'';
  } else {
    return ''Request failed to send'';
  }
};',
            'JavaScript',
            ARRAY['utils', 'api', 'error-handling'],
            false,
            sample_user_id
        ),
        (
            'Debounce Function',
            'Utility function to debounce rapid function calls',
            'const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Usage example:
const debouncedSearch = debounce((query) => {
  console.log(''Searching for:'', query);
}, 300);',
            'JavaScript',
            ARRAY['utils', 'performance'],
            true,
            sample_user_id
        );
    END IF;
END $$;
