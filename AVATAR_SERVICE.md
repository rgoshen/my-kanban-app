# Avatar Service Integration

This feature branch adds a comprehensive avatar service to the Kanban app that generates professional avatars for task assignees using an external API service.

## Features

### 🎨 **Professional Avatar Generation**

- Uses [DiceBear API](https://www.dicebear.com/) for high-quality avatar images
- Generates consistent avatars based on assignee names
- Supports multiple background colors and styling options

### 🎯 **Smart Fallbacks**

- Graceful fallback to colored initials when images fail to load
- Consistent color generation for each unique name
- Handles edge cases (empty names, special characters, etc.)

### ⚡ **Performance Optimizations**

- Client-side caching with configurable timeout
- Preloading support for better user experience
- Efficient image loading with error handling

### 🎛️ **Flexible Configuration**

- Multiple avatar sizes (sm, md, lg)
- Customizable color schemes
- Configurable cache timeout and preloading options

## Architecture

### Core Components

1. **AvatarService** (`src/lib/avatar-service.ts`)
   - Main service class for avatar generation
   - Handles API calls to DiceBear
   - Manages color generation and fallbacks

2. **useAvatar Hook** (`src/hooks/use-avatar.ts`)
   - React hook for avatar data management
   - Handles caching and state management
   - Provides loading and error states

3. **EnhancedAvatar Component** (`src/components/ui/enhanced-avatar.tsx`)
   - Drop-in replacement for basic Avatar component
   - Integrates with avatar service
   - Supports loading states and error handling

### File Structure

```
src/
├── lib/
│   └── avatar-service.ts          # Core avatar service
├── hooks/
│   └── use-avatar.ts             # Avatar management hook
├── components/
│   ├── ui/
│   │   └── enhanced-avatar.tsx   # Enhanced avatar component
│   └── avatar-demo.tsx           # Demo component
└── types/
    └── task.ts                   # Task type (unchanged)
```

## Usage

### Basic Usage

```tsx
import { EnhancedAvatar } from "@/components/ui/enhanced-avatar";

function TaskCard({ task }) {
  return (
    <div>
      <EnhancedAvatar assigneeName={task.assignee} size="sm" />
      <span>{task.assignee}</span>
    </div>
  );
}
```

### Advanced Usage

```tsx
import { EnhancedAvatar } from "@/components/ui/enhanced-avatar";
import { useAvatar } from "@/hooks/use-avatar";

function CustomAvatarComponent({ assigneeName }) {
  const { avatarData, isLoading, error, refreshAvatar } = useAvatar(assigneeName, {
    enablePreloading: true,
    cacheTimeout: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <div>
      <EnhancedAvatar
        assigneeName={assigneeName}
        size="lg"
        showLoadingState={true}
        onError={(error) => console.error("Avatar error:", error)}
      />
      {isLoading && <span>Loading avatar...</span>}
      {error && <span>Error: {error}</span>}
      <button onClick={refreshAvatar}>Refresh</button>
    </div>
  );
}
```

### Preloading Multiple Avatars

```tsx
import { useAvatarPreloader } from "@/hooks/use-avatar";

function KanbanBoard({ tasks }) {
  const assigneeNames = tasks.map((task) => task.assignee).filter(Boolean);

  const { isPreloading } = useAvatarPreloader(assigneeNames);

  return (
    <div>
      {isPreloading && <div>Preloading avatars...</div>}
      {/* Your board content */}
    </div>
  );
}
```

## API Integration

### DiceBear API

The service integrates with DiceBear's initials avatar API:

- **Endpoint**: `https://api.dicebear.com/7.x/initials/svg`
- **Parameters**:
  - `seed`: Normalized assignee name
  - `backgroundColor`: Array of pastel colors
  - `textColor`: Black text for contrast
  - `size`: 40px for optimal quality

### Error Handling

- Network failures fallback to initials
- Invalid names handled gracefully
- Console warnings for debugging

## Configuration

### AvatarService Configuration

```typescript
// In avatar-service.ts
private static readonly AVATAR_API_BASE = 'https://api.dicebear.com/7.x/initials/svg';
private static readonly FALLBACK_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  // ... more colors
];
```

### Hook Configuration

```typescript
const { avatarData, isLoading, error } = useAvatar(assigneeName, {
  enablePreloading: true, // Enable avatar preloading
  cacheTimeout: 300000, // 5 minutes cache timeout
});
```

## Migration Guide

### From Basic Avatar to Enhanced Avatar

**Before:**

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

<Avatar className="h-5 w-5">
  <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
    {getInitials(task.assignee)}
  </AvatarFallback>
</Avatar>;
```

**After:**

```tsx
import { EnhancedAvatar } from "@/components/ui/enhanced-avatar";

<EnhancedAvatar assigneeName={task.assignee} size="sm" className="h-5 w-5" />;
```

## Testing

The avatar service includes comprehensive error handling and edge case management:

- ✅ Empty/undefined assignee names
- ✅ Names with special characters
- ✅ Very long names
- ✅ Network failures
- ✅ API rate limiting
- ✅ Invalid responses

## Performance Considerations

1. **Caching**: Avatars are cached for 5 minutes by default
2. **Preloading**: Optional preloading for better UX
3. **Lazy Loading**: Images load only when needed
4. **Error Recovery**: Graceful fallbacks prevent UI breaks

## Future Enhancements

Potential improvements for future iterations:

1. **Custom Avatar Uploads**: Allow users to upload custom avatars
2. **Avatar Preferences**: User-configurable avatar styles
3. **Offline Support**: Cache avatars for offline viewing
4. **Avatar Groups**: Support for multiple assignees per task
5. **Integration APIs**: Connect to user management systems

## Dependencies

- **External**: DiceBear API (no API key required)
- **Internal**: Existing UI components and utilities
- **React**: Hooks for state management

## Browser Support

- Modern browsers with ES6+ support
- Fetch API for HTTP requests
- CSS Grid and Flexbox for layout
