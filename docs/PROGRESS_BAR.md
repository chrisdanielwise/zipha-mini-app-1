# Progress Bar Implementation Guide

## Overview
The progress bar system uses `nprogress` library with custom styling and React hooks for seamless integration across the application.

## Features
- ✅ **Automatic Route Progress**: Shows progress bar during page navigation
- ✅ **Manual Control**: Control progress bar in components and forms
- ✅ **Dark Mode Support**: Adapts to light/dark themes
- ✅ **Custom Styling**: Beautiful gradient progress bar with glow effects
- ✅ **TypeScript Support**: Full type safety with custom hooks
- ✅ **Mobile Responsive**: Works perfectly on all devices

## Installation
Already installed and configured! The progress bar is active across all pages.

## Usage

### 1. Automatic Route Progress
The progress bar automatically appears when navigating between pages. No additional code needed!

### 2. Manual Progress Control

#### Using the `useProgress` Hook
```tsx
import { useProgress } from '../hooks/useProgress';

function MyComponent() {
  const progress = useProgress();

  const handleAsyncOperation = async () => {
    progress.start();
    
    try {
      // Step 1
      progress.set(0.3);
      await apiCall1();
      
      // Step 2
      progress.set(0.6);
      await apiCall2();
      
      // Step 3
      progress.set(0.9);
      await apiCall3();
      
      progress.finish();
    } catch (error) {
      progress.finish();
      throw error;
    }
  };

  return (
    <button onClick={handleAsyncOperation}>
      Start Operation
    </button>
  );
}
```

#### Available Methods
- `progress.start()` - Start the progress bar
- `progress.finish()` - Complete the progress bar
- `progress.set(0.5)` - Set progress to 50% (0-1 range)
- `progress.increment(0.1)` - Increment progress by 10%
- `progress.isStarted()` - Check if progress is active

### 3. Using the `withProgress` Utility
```tsx
import { withProgress } from '../hooks/useProgress';

const handleSubmit = async () => {
  await withProgress(async () => {
    await submitForm();
  });
};

// With progress steps
const handleMultiStep = async () => {
  await withProgress(
    async () => {
      await step1();
      await step2();
      await step3();
    },
    {
      steps: 3,
      onProgress: (progress) => console.log(`Progress: ${progress * 100}%`)
    }
  );
};
```

### 4. Using the ProgressButton Component
```tsx
import ProgressButton from '../components/ui/ProgressButton';

function MyForm() {
  const handleSubmit = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <ProgressButton
      onAsyncClick={handleSubmit}
      loadingText="Submitting..."
      variant="primary"
      size="md"
    >
      Submit Form
    </ProgressButton>
  );
}
```

#### ProgressButton Props
- `onAsyncClick?: () => Promise<void>` - Async function to execute
- `loading?: boolean` - External loading state
- `loadingText?: string` - Text to show while loading
- `variant?: 'primary' | 'secondary' | 'danger' | 'success'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size

### 5. Global Window Functions (Legacy Support)
```javascript
// Available globally (not recommended, use hooks instead)
window.startProgress();
window.finishProgress();
window.setProgress(0.5);
window.incrementProgress(0.1);
```

## Examples

### Form Submission with Progress
```tsx
const LoginForm = () => {
  const progress = useProgress();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData) => {
    setLoading(true);
    progress.start();

    try {
      // Validate
      progress.set(0.2);
      await validateCredentials(formData);
      
      // Authenticate
      progress.set(0.5);
      const token = await authenticate(formData);
      
      // Load user data
      progress.set(0.8);
      await loadUserData(token);
      
      progress.finish();
      // Redirect to dashboard
    } catch (error) {
      progress.finish();
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
};
```

### API Call with Progress
```tsx
const DataTable = () => {
  const progress = useProgress();

  const fetchData = async () => {
    progress.start();
    
    try {
      const response = await fetch('/api/data');
      progress.set(0.7);
      
      const data = await response.json();
      progress.set(0.9);
      
      setData(data);
      progress.finish();
    } catch (error) {
      progress.finish();
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
};
```

### File Upload with Progress
```tsx
const FileUpload = () => {
  const progress = useProgress();

  const uploadFile = async (file) => {
    progress.start();
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.loaded / progressEvent.total;
          progress.set(percentCompleted);
        }
      });
      
      progress.finish();
      return await response.json();
    } catch (error) {
      progress.finish();
      throw error;
    }
  };
};
```

## Styling Customization

The progress bar uses custom CSS with gradient colors and glow effects. To customize:

1. Edit `src/components/providers/ProgressBarProvider.tsx`
2. Modify the `progressBarStyles` constant
3. Update colors, height, animations as needed

### Current Style Features
- **Gradient Background**: Blue to purple to pink gradient
- **Glow Effect**: Subtle shadow and glow
- **Dark Mode**: Automatic adaptation to dark theme
- **Height**: 3px with rounded corners
- **Z-Index**: 9999 to appear above all content

## Best Practices

1. **Always Finish Progress**: Use try/catch/finally to ensure progress.finish() is called
2. **Meaningful Steps**: Set progress at logical steps (0.3, 0.6, 0.9)
3. **Error Handling**: Always finish progress on errors
4. **User Feedback**: Combine with loading states and toast notifications
5. **Performance**: Don't call progress.set() too frequently

## Troubleshooting

### Progress Bar Not Showing
- Check if ProgressBarProvider is added to layout.tsx
- Ensure nprogress CSS is imported
- Verify no CSS conflicts with z-index

### Progress Stuck
- Make sure progress.finish() is called in all code paths
- Check for uncaught exceptions
- Verify async operations complete properly

### Styling Issues
- Check CSS specificity
- Verify dark mode media queries
- Ensure custom styles are injected properly

## Integration Status
✅ **Root Layout**: ProgressBarProvider added
✅ **Login Page**: Form submission with progress
✅ **Coupons Page**: API calls with progress
✅ **Subscribers Page**: Data fetching with progress
✅ **Route Changes**: Automatic progress on navigation

The progress bar is now fully integrated and ready to use across your application! 