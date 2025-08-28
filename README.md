# 🇵🇸 Gaza Memorial Visualization

An interactive 3D memorial honoring the lives lost in Gaza through immersive particle visualization and audio storytelling.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://gazamemory.org)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/latentsmurf/gazasphere)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-green)](https://threejs.org)

## 📖 About

This project creates a powerful, interactive memorial that transforms casualty data into a mesmerizing 3D particle system. Each particle represents a life lost, creating an emotional and thought-provoking experience that honors the human cost of conflict.

### 🎯 Mission
- **Memorialize Lives**: Each particle represents an individual lost
- **Educate**: Provide context through data visualization
- **Humanize Statistics**: Transform numbers into emotional impact
- **Preserve Memory**: Create an eternal digital memorial

## ✨ Key Features

### 🎨 Visual Experience
- **Organic Sphere Distortion**: Particles form naturally irregular, organic shapes instead of perfect spheres
- **Multi-layer Noise**: Complex surface textures with fractal-like patterns
- **Dynamic Lighting**: Atmospheric effects with customizable lighting
- **Particle Trails**: Beautiful ascension effects for particles "breaking free"
- **Creative Shaders**: Multiple visual atmospheres (Ethereal, Cosmic, Aurora)

### 🎵 Audio Integration
- **Memorial Audio**: Background instrumental honoring the lost
- **Voice Narration**: Text-to-speech for casualty information
- **Audio Visualization**: Particles respond to sound frequencies
- **Playback Controls**: Full audio management system

### 📊 Data Visualization
- **Real-time Data**: Live updates from multiple sources
- **CSV Fallback**: Offline functionality with backup data
- **Interactive Filtering**: Filter by date, location, demographics
- **Historical Timeline**: Navigate through time periods

### 🚀 Performance & Reliability
- **Fallback System**: API failures automatically switch to local data
- **Optimized Rendering**: Efficient particle physics with frame skipping
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Enhanced UX with progress indicators

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.5.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### 3D Graphics & Visualization
- **Three.js** - WebGL 3D graphics engine
- **React Three Fiber** - React renderer for Three.js
- **Custom GLSL Shaders** - Advanced visual effects
- **Particle Systems** - Complex physics simulations

### Audio & Media
- **Web Audio API** - Audio analysis and playback
- **Text-to-Speech** - Voice narration system
- **Audio Visualization** - Real-time frequency analysis

### Data & State Management
- **Zustand** - Lightweight state management
- **CSV Processing** - Local data fallback system
- **API Integration** - Multiple data sources with error handling

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/latentsmurf/gazasphere.git
   cd gazasphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎮 Usage Guide

### Basic Interaction
- **Click particles** to view individual stories
- **Hover** for particle highlighting
- **Drag to rotate** the camera
- **Scroll to zoom** in/out

### Controls Panel
- **Sphere Shape**: Adjust overall distortion (1.0 = perfect sphere, higher = more irregular)
- **Noise**: Control surface texture complexity
- **Pulse**: Adjust organic breathing effect
- **Trails**: Enable/disable ascension particle trails
- **Audio**: Control playback and volume

### Data Sources
- **Primary**: Live API data from humanitarian organizations
- **Fallback**: Local CSV files for offline functionality
- **Backup**: West Bank and infrastructure damage data

## 📁 Project Structure

```
gaza-info-viz/
├── public/                    # Static assets
│   ├── memorial-data.json    # Primary data source
│   ├── casualties_daily.csv  # Daily casualty backup
│   ├── west_bank_daily.csv   # West Bank data backup
│   ├── infrastructure-damaged.csv  # Damage data backup
│   └── Memorial_Instrumental_Loop.mp3  # Memorial audio
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/          # React components
│   │   ├── AudioPlayback.tsx     # Audio system
│   │   ├── CameraController.tsx  # Camera controls
│   │   ├── FiltersPanel.tsx      # Data filtering
│   │   ├── GlyphField.tsx        # Text rendering
│   │   ├── LayoutMorpher.tsx     # Layout transitions
│   │   ├── ModeSelector.tsx      # Visualization modes
│   │   ├── PersonDrawer.tsx      # Individual profiles
│   │   ├── PlaybackBar.tsx       # Audio controls
│   │   ├── SceneCanvas.tsx       # Main 3D scene
│   │   ├── SocialShare.tsx       # Social sharing
│   │   ├── UnifiedSidebar.tsx    # Main controls
│   │   ├── VisualizationPanel.tsx # Additional controls
│   │   └── ui/                   # UI components
│   └── lib/                  # Utilities and services
│       ├── audioQueue.ts     # Audio queue management
│       ├── dataLoader.ts     # Data loading & fallback
│       ├── filters.ts        # Data filtering logic
│       ├── shaders/          # GLSL shader files
│       │   ├── particle.frag.glsl
│       │   ├── particle.vert.glsl
│       │   └── [other shaders]
│       ├── store.ts          # Global state management
│       ├── tts.ts           # Text-to-speech
│       └── utils.ts         # Utility functions
└── [config files]
```

## 🔧 Configuration

### Visual Settings
Adjust the visualization through the sidebar controls:

- **Particle Size**: Control individual particle size
- **Particle Opacity**: Adjust transparency
- **Glow Intensity**: Control particle glow effect
- **Sphere Distortion**: Shape irregularity (1.0-2.0)
- **Noise**: Surface texture complexity (0.0-0.5)
- **Pulse**: Organic movement intensity (0.0-0.5)

### Audio Settings
- **Master Volume**: Overall audio level
- **Voice Volume**: Narration volume
- **Music Volume**: Background music level
- **Voice Rate**: Speech speed
- **Voice Pitch**: Speech pitch

## ⚡ Performance Optimizations

### Current Performance Features

#### 🎯 Frame Management
- **Physics Frame Skipping**: Physics calculations run every other frame (50% reduction)
- **Shader Updates**: Uniform updates every 3rd frame (66% reduction)
- **Selective Logging**: Debug logs only every 60 frames

#### 🌐 Particle Limits
- **Safari**: 15,000 particles (optimized for WebKit performance)
- **Modern Browsers**: 25,000 particles (maximum representation)
- **Automatic Detection**: Browser-specific optimization

#### 🧮 Computation Optimization
- **Flocking Sample Size**: Reduced from 50 to 20 nearby particles
- **Distance Calculations**: Optimized spatial queries
- **Memory Management**: Efficient buffer reuse

#### 🎨 Rendering Optimization
- **LOD System**: Level-of-detail based on camera distance
- **Culling**: Particles outside view frustum are skipped
- **Batch Updates**: Grouped geometry updates

### Performance Recommendations

#### 🚀 Potential Improvements
1. **Web Workers**: Move physics calculations to background threads
2. **Instancing**: Use GPU instancing for identical particles
3. **Occlusion Culling**: Hide particles behind others
4. **Texture Atlasing**: Combine multiple textures
5. **Geometry LOD**: Simplify distant particles

#### 📊 Monitoring
- **FPS Counter**: Real-time performance monitoring
- **Particle Count**: Dynamic adjustment based on performance
- **Memory Usage**: Monitor for leaks

## 🏗️ Code Organization & Architecture

### Current Structure Analysis

#### ✅ Strengths
- **Clear Separation**: Logical grouping of components, utilities, and assets
- **Modular Design**: Well-separated concerns between UI, data, and 3D rendering
- **Consistent Naming**: Components follow PascalCase, utilities use camelCase
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions

#### 📁 Directory Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main memorial visualization page
├── components/             # React components
│   ├── ui/                # Reusable UI primitives
│   ├── AudioPlayback.tsx  # Memorial narration system
│   ├── CameraController.tsx # 3D camera management
│   ├── FiltersPanel.tsx   # Data filtering interface
│   ├── ModeSelector.tsx   # Visualization mode controls
│   ├── SceneCanvas.tsx    # Main 3D scene renderer
│   ├── UnifiedSidebar.tsx # Primary control panel
│   └── VisualizationPanel.tsx # Secondary visualization controls
└── lib/                   # Utilities and business logic
    ├── shaders/           # GLSL shader programs
    ├── audioQueue.ts      # Audio playback queue (empty)
    ├── dataLoader.ts      # API data fetching and processing
    ├── filters.ts         # Data filtering utilities (empty)
    ├── store.ts           # Zustand state management
    ├── tts.ts             # Text-to-speech utilities
    └── utils.ts           # General utility functions
```

### Code Organization Recommendations

#### 🔧 Areas for Improvement

##### 1. **Empty Utility Files Cleanup**
**Issue**: Several utility files are empty or minimally used
- `audioQueue.ts` - Empty file
- `filters.ts` - Empty file

**Recommendation**:
```typescript
// Option A: Remove unused files
rm src/lib/audioQueue.ts src/lib/filters.ts

// Option B: Consolidate related functionality
// Move TTS functionality to AudioPlayback component
// Implement filtering logic directly in dataLoader.ts
```

##### 2. **Component Organization Enhancement**
**Issue**: Some components lack comprehensive documentation

**Recommendation**: Standardize component structure:
```typescript
/**
 * @fileoverview ComponentName - Component description
 *
 * Key Features:
 * - Feature 1
 * - Feature 2
 *
 * @author Gaza Memorial Project
 */

'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'

// Types and interfaces
interface ComponentProps {
  // props definition
}

// Helper functions (if complex)
function helperFunction() {
  // implementation
}

export default function ComponentName({ prop }: ComponentProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    // JSX
  )
}
```

##### 3. **Shader Organization**
**Current**: All shaders in single `shaders/` directory
**Recommendation**: Organize by functionality:
```
lib/
└── shaders/
    ├── particle/          # Particle system shaders
    │   ├── vertex.glsl
    │   └── fragment.glsl
    ├── environment/       # Background/environment shaders
    │   ├── cloud.frag.glsl
    │   └── sky.vert.glsl
    └── effects/           # Special effects shaders
        ├── morph.vert.glsl
        └── glyph_sdf.frag.glsl
```

##### 4. **Constants and Configuration**
**Recommendation**: Create centralized configuration:
```typescript
// lib/config.ts
export const APP_CONFIG = {
  PARTICLE_LIMITS: {
    SAFARI: 15000,
    MODERN: 25000
  },
  API_TIMEOUT: 15000,
  SHADER_MODES: {
    DEFAULT: 0,
    ETHEREAL: 1,
    COSMIC: 2,
    AURORA: 3
  }
} as const
```

##### 5. **Error Handling Standardization**
**Recommendation**: Create consistent error handling patterns:
```typescript
// lib/errors.ts
export class MemorialError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message)
    this.name = 'MemorialError'
  }
}

export function handleApiError(error: unknown, context: string): MemorialError {
  // Standardized error handling
}
```

### Implementation Priority

#### 🚨 High Priority
1. **Remove empty utility files** - Clean up unused code
2. **Add missing JSDoc documentation** - Complete component documentation
3. **Standardize component structure** - Consistent patterns across components

#### 📊 Medium Priority
1. **Reorganize shader files** - Better grouping by functionality
2. **Create configuration constants** - Centralized app configuration
3. **Implement error handling utilities** - Standardized error patterns

#### 🔮 Low Priority
1. **Performance monitoring utilities** - Add FPS/memory monitoring
2. **Build optimization scripts** - Bundle analysis tools
3. **Development helpers** - Hot reload optimizations

### Benefits of Improved Organization

#### 🧹 **Maintainability**
- **Clearer Dependencies**: Easy to understand component relationships
- **Consistent Patterns**: Predictable code structure across the project
- **Better Documentation**: Comprehensive inline documentation

#### 🚀 **Developer Experience**
- **Faster Onboarding**: New developers can quickly understand the codebase
- **Easier Debugging**: Clear separation of concerns aids troubleshooting
- **Consistent APIs**: Standardized interfaces across components

#### 📈 **Scalability**
- **Modular Growth**: Easy to add new features following established patterns
- **Team Collaboration**: Consistent structure enables parallel development
- **Future Maintenance**: Well-organized code is easier to refactor and extend

### Migration Strategy

#### Phase 1: Cleanup (Week 1)
- [ ] Remove empty utility files
- [ ] Add JSDoc to undocumented components
- [ ] Standardize component structure patterns

#### Phase 2: Reorganization (Week 2)
- [ ] Reorganize shader files by functionality
- [ ] Create centralized configuration file
- [ ] Implement standardized error handling

#### Phase 3: Enhancement (Week 3)
- [ ] Add performance monitoring utilities
- [ ] Create development helper scripts
- [ ] Implement automated code quality checks

## ♿ Accessibility & Inclusive Design

### Current Accessibility State

#### ✅ Strengths
- **Radix UI Components**: Using accessible primitives with built-in ARIA support
- **Semantic HTML**: Proper heading structure and meaningful content
- **Keyboard Navigation**: Basic keyboard support through Radix components
- **Color Contrast**: Good contrast ratios for text readability
- **Font Loading**: Optimized web fonts with fallbacks

#### 🎯 Areas for Enhancement

##### 1. **3D Canvas Accessibility**
**Issue**: The main 3D visualization is not accessible to screen readers

**Current State**:
```typescript
// SceneCanvas renders 3D particles without text alternatives
<Canvas>
  <Particles data={casualtyData} />
</Canvas>
```

**Recommended Solution**:
```typescript
// Add comprehensive ARIA description and live region
<div
  role="img"
  aria-label={`${casualtyCount} lives remembered in interactive memorial`}
  aria-describedby="memorial-description"
  aria-live="polite"
>
  <Canvas aria-hidden="true">
    <Particles data={casualtyData} />
  </Canvas>

  {/* Hidden description for screen readers */}
  <div id="memorial-description" className="sr-only">
    Interactive memorial visualization showing {casualtyCount} lives lost.
    Each particle represents a Palestinian life from Gaza and West Bank.
    Use controls to filter by age, gender, and location.
  </div>
</div>
```

##### 2. **Data Table Alternative**
**Recommendation**: Provide tabular data view for screen reader users:
```typescript
// Add toggle between 3D view and accessible data table
const [viewMode, setViewMode] = useState<'3d' | 'table'>('3d')

return (
  <div>
    <div className="mb-4">
      <button onClick={() => setViewMode('3d')}>3D Visualization</button>
      <button onClick={() => setViewMode('table')}>Data Table</button>
    </div>

    {viewMode === '3d' ? (
      <Canvas aria-hidden="true">{/* 3D Scene */}</Canvas>
    ) : (
      <div role="table" aria-label="Memorial data table">
        <div role="rowgroup">
          <div role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">Age</span>
            <span role="columnheader">Gender</span>
            {/* ... */}
          </div>
          {filteredData.map(person => (
            <div key={person.id} role="row">
              <span role="cell">{person.name_en}</span>
              <span role="cell">{person.age}</span>
              {/* ... */}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)
```

##### 3. **Audio Description Enhancement**
**Current**: Audio narration during memorial playback
**Enhancement**: Add descriptive audio for interface navigation:
```typescript
// Add screen reader announcements for state changes
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.textContent = message
  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Usage
announceToScreenReader(`Filtered to show ${filteredCount} lives`)
```

##### 4. **Keyboard Navigation Improvements**
**Current**: Basic keyboard support through Radix components
**Enhancements**:
```typescript
// Add keyboard shortcuts for common actions
useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'f':
          event.preventDefault()
          // Focus filter panel
          break
        case 's':
          event.preventDefault()
          // Toggle settings
          break
        case 'p':
          event.preventDefault()
          // Toggle playback
          break
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [])
```

##### 5. **Focus Management**
**Recommendations**:
```typescript
// Improve focus flow during auto-playback
useEffect(() => {
  if (focusedPerson && isAutoPlaying) {
    // Announce focused person to screen readers
    announceToScreenReader(
      `Now remembering ${focusedPerson.name_en}, age ${focusedPerson.age}`
    )
  }
}, [focusedPerson, isAutoPlaying])
```

##### 6. **Color and Visual Accessibility**
**Current Assessment**: Good contrast ratios
**Enhancements**:
```typescript
// Add high contrast mode support
const [highContrast, setHighContrast] = useState(false)

// Detect user preference
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-contrast: high)')
  setHighContrast(mediaQuery.matches)

  const handleChange = (e: MediaQueryListEvent) => {
    setHighContrast(e.matches)
  }

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}, [])

// Apply high contrast styles
className={highContrast ? 'high-contrast-theme' : 'normal-theme'}
```

##### 7. **Motion and Animation Sensitivity**
**Recommendations**:
```typescript
// Respect prefers-reduced-motion
const [reducedMotion, setReducedMotion] = useState(false)

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  setReducedMotion(mediaQuery.matches)

  const handleChange = (e: MediaQueryListEvent) => {
    setReducedMotion(e.matches)
  }

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}, [])

// Apply reduced motion settings
const animationDuration = reducedMotion ? 0 : 0.3
```

##### 8. **Language and Localization**
**Current**: Arabic/English support
**Enhancements**:
```typescript
// Add language switching with proper announcements
const [language, setLanguage] = useState<'en' | 'ar'>('en')

function changeLanguage(newLang: 'en' | 'ar') {
  setLanguage(newLang)
  announceToScreenReader(`Language changed to ${newLang === 'en' ? 'English' : 'العربية'}`)

  // Update document language
  document.documentElement.lang = newLang === 'en' ? 'en-US' : 'ar-SA'
}
```

### Implementation Priority

#### 🚨 Critical Accessibility (Immediate)
1. **Add ARIA labels to 3D canvas** - Screen reader description
2. **Implement data table alternative** - Accessible data view
3. **Add live regions for dynamic content** - State change announcements

#### 📊 Important Accessibility (Soon)
1. **Keyboard navigation improvements** - Shortcuts and focus management
2. **Audio descriptions** - Enhanced screen reader support
3. **High contrast mode** - Visual accessibility support

#### 🔮 Enhanced Accessibility (Future)
1. **Motion sensitivity support** - Respect user preferences
2. **Advanced screen reader features** - Detailed navigation
3. **Accessibility testing automation** - Continuous monitoring

### Accessibility Testing Checklist

#### 🖥️ Screen Reader Testing
- [ ] NVDA (Windows) + Firefox/Chrome
- [ ] JAWS (Windows) + Internet Explorer
- [ ] VoiceOver (macOS) + Safari
- [ ] Orca (Linux) + Firefox
- [ ] TalkBack (Android) + Chrome

#### ⌨️ Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Arrow key navigation in menus
- [ ] Enter/Space activation
- [ ] Escape to close modals
- [ ] Keyboard shortcuts documented

#### 🎨 Visual Accessibility
- [ ] Color contrast ratios (WCAG AA: 4.5:1, AAA: 7:1)
- [ ] Focus indicators clearly visible
- [ ] Text size adjustable (zoom to 200%)
- [ ] Color blindness simulation testing

#### 🔊 Audio Accessibility
- [ ] Audio descriptions for visual content
- [ ] Captions/transcripts for audio content
- [ ] Volume controls accessible
- [ ] Audio content doesn't auto-play (unless requested)

### Success Metrics

#### 📊 Quantitative Metrics
- **Lighthouse Accessibility Score**: Target 95+
- **Keyboard Navigation Coverage**: 100% of interactive elements
- **Screen Reader Compatibility**: Support all major screen readers
- **Color Contrast Compliance**: 100% WCAG AA compliance

#### 🎯 Qualitative Metrics
- **User Testing**: Positive feedback from users with disabilities
- **Expert Review**: Accessibility expert evaluation passed
- **Compliance**: WCAG 2.1 AA compliance achieved
- **Documentation**: Comprehensive accessibility documentation

### Benefits of Enhanced Accessibility

#### 🌍 **Inclusive Memorial Experience**
- **Broader Reach**: Memorial accessible to people with disabilities
- **Equal Access**: Everyone can honor the lives remembered
- **Cultural Respect**: Proper Arabic language support
- **Global Accessibility**: Works across different assistive technologies

#### 🧹 **Technical Benefits**
- **Better SEO**: Semantic HTML improves search engine indexing
- **Enhanced UX**: Keyboard navigation improves usability for all users
- **Future-Proof**: Accessible design principles benefit ongoing maintenance
- **Legal Compliance**: Meets accessibility standards and regulations

#### 🚀 **Community Impact**
- **Educational Value**: Teaches accessibility best practices
- **Community Inclusion**: Makes memorial accessible to Palestinian community
- **International Reach**: Accessible to users worldwide regardless of ability
- **Social Impact**: Demonstrates commitment to inclusive remembrance

This accessibility enhancement plan will transform the Gaza Memorial from a visually impressive 3D experience into a truly inclusive memorial that honors all lives and serves all people, regardless of their abilities or assistive technology needs.

## 🧪 Testing Coverage & Quality Assurance

### Current Testing State

#### 📊 Assessment
- **Test Framework**: None configured
- **Test Files**: No test files found
- **Coverage**: 0% test coverage
- **CI/CD**: No automated testing pipeline

#### 🎯 Critical Testing Needs

##### 1. **Data Loading Reliability**
**Priority**: CRITICAL - Data integrity affects memorial accuracy

**Required Tests**:
```typescript
// __tests__/lib/dataLoader.test.ts
describe('DataLoader API Resilience', () => {
  test('should fallback to CSV when API fails', async () => {
    // Mock API failure
    global.fetch = jest.fn(() => Promise.reject(new Error('API Error')))

    const data = await loadKilledInGaza()
    expect(data.length).toBeGreaterThan(0)
    expect(data).toEqual(expect.any(Array))
  })

  test('should handle malformed API responses gracefully', async () => {
    // Mock invalid JSON response
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(null)
    }))

    const data = await loadKilledInGaza()
    expect(data).toEqual([])
  })

  test('should respect 15-second timeout', async () => {
    // Mock slow API response
    global.fetch = jest.fn(() => new Promise(resolve => {
      setTimeout(() => resolve({ ok: true, json: () => [] }), 20000)
    }))

    const startTime = Date.now()
    await loadKilledInGaza()
    const duration = Date.now() - startTime

    expect(duration).toBeLessThan(16000) // Should timeout before 20s
  })
})
```

##### 2. **State Management Testing**
**Priority**: HIGH - State bugs could break entire memorial experience

**Required Tests**:
```typescript
// __tests__/lib/store.test.ts
describe('Memorial State Management', () => {
  const { useStore } = require('../lib/store')

  beforeEach(() => {
    // Reset store state before each test
    useStore.getState().setFilters({
      gender: 'all',
      ageRange: [0, 120],
      source: 'all',
      nameSearch: '',
      type: 'all'
    })
  })

  test('should filter data correctly', () => {
    const { filters, isFiltered } = useStore.getState()

    // Test gender filtering
    useStore.getState().setFilters({ gender: 'female' })
    expect(useStore.getState().isFiltered()).toBe(true)

    // Test age filtering
    useStore.getState().setFilters({ ageRange: [0, 18] })
    expect(useStore.getState().isFiltered()).toBe(true)

    // Reset and verify
    useStore.getState().setFilters({
      gender: 'all',
      ageRange: [0, 120],
      source: 'all',
      nameSearch: '',
      type: 'all'
    })
    expect(useStore.getState().isFiltered()).toBe(false)
  })

  test('should manage playback queue correctly', () => {
    const testData: Casualty[] = [
      { id: '1', name_en: 'Test 1', age: 25, gender: 'male', source: 'test' },
      { id: '2', name_en: 'Test 2', age: 30, gender: 'female', source: 'test' }
    ]

    useStore.getState().setPlaybackQueue(testData)

    const { playbackQueue } = useStore.getState()
    expect(playbackQueue).toHaveLength(2)
    expect(playbackQueue[0].name_en).toBe('Test 1')
  })

  test('should handle auto-playback state transitions', () => {
    // Test auto-playback start
    useStore.getState().setAutoPlaying(true)
    expect(useStore.getState().isAutoPlaying).toBe(true)

    // Test auto-playback stop
    useStore.getState().stopAutoPlayback()
    expect(useStore.getState().isAutoPlaying).toBe(false)
    expect(useStore.getState().playbackState).toBe('paused')
  })
})
```

##### 3. **Component Testing**
**Priority**: HIGH - UI bugs affect user experience

**Required Tests**:
```typescript
// __tests__/components/FiltersPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import FiltersPanel from '../components/FiltersPanel'

describe('FiltersPanel Component', () => {
  const mockData: Casualty[] = [
    { id: '1', name_en: 'Test Child', age: 12, gender: 'male', source: 'test' },
    { id: '2', name_en: 'Test Adult', age: 35, gender: 'female', source: 'test' }
  ]

  test('should render filter controls', () => {
    render(<FiltersPanel data={mockData} />)

    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Age Range')).toBeInTheDocument()
    expect(screen.getByText('Source')).toBeInTheDocument()
  })

  test('should filter by gender', () => {
    render(<FiltersPanel data={mockData} />)

    const femaleOption = screen.getByRole('option', { name: 'Female' })
    fireEvent.click(femaleOption)

    // Verify filtering logic is called (would need mock setup)
    expect(screen.getByText('Female')).toBeInTheDocument()
  })

  test('should show statistics correctly', () => {
    render(<FiltersPanel data={mockData} />)

    expect(screen.getByText('Children (under 18)')).toBeInTheDocument()
    expect(screen.getByText('Adults (18-60)')).toBeInTheDocument()
  })
})
```

##### 4. **Performance Testing**
**Priority**: MEDIUM - Performance affects memorial experience

**Required Tests**:
```typescript
// __tests__/performance/particleRendering.test.ts
describe('Particle Rendering Performance', () => {
  test('should handle 25,000 particles without crashing', () => {
    const particleCount = 25000
    const particles = generateTestParticles(particleCount)

    const startTime = performance.now()
    render(<ParticleSystem particles={particles} />)
    const endTime = performance.now()

    expect(endTime - startTime).toBeLessThan(100) // Initial render < 100ms
  })

  test('should maintain 30 FPS during physics updates', async () => {
    const particleCount = 10000
    const frameTimes: number[] = []

    // Simulate 60 frames
    for (let i = 0; i < 60; i++) {
      const startTime = performance.now()
      await updatePhysics(particleCount)
      const endTime = performance.now()
      frameTimes.push(endTime - startTime)
    }

    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
    const fps = 1000 / avgFrameTime

    expect(fps).toBeGreaterThan(30) // Maintain 30+ FPS
  })
})
```

##### 5. **Accessibility Testing**
**Priority**: HIGH - Accessibility is critical for inclusive memorial

**Required Tests**:
```typescript
// __tests__/accessibility/memorial.a11y.test.ts
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import MemorialApp from '../app/page'

describe('Memorial Accessibility', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(<MemorialApp />)
    const results = await axe(container)

    expect(results.violations).toHaveLength(0)
  })

  test('should provide text alternatives for 3D canvas', () => {
    render(<MemorialApp />)

    const canvas = screen.getByRole('img', {
      name: /lives remembered in interactive memorial/i
    })

    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('aria-describedby')
  })

  test('should support keyboard navigation', () => {
    render(<MemorialApp />)

    // Test tab navigation through interactive elements
    const interactiveElements = screen.getAllByRole('button')
    expect(interactiveElements.length).toBeGreaterThan(0)

    // Verify all interactive elements are keyboard accessible
    interactiveElements.forEach(element => {
      expect(element).toHaveAttribute('tabIndex') // or be naturally focusable
    })
  })

  test('should announce dynamic content changes', () => {
    render(<MemorialApp />)

    // Trigger a filter change
    const filterButton = screen.getByRole('button', { name: /filter/i })
    fireEvent.click(filterButton)

    // Verify screen reader announcement
    const announcement = screen.getByRole('status')
    expect(announcement).toHaveTextContent(/filtered to show/i)
  })
})
```

### Recommended Testing Infrastructure

#### 🛠️ Testing Tools Setup
```json
// package.json additions
{
  "devDependencies": {
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@types/jest": "^29.5.0",
    "jest-axe": "^8.0.0",
    "msw": "^2.3.0",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:accessibility": "jest --testPathPattern=accessibility"
  }
}
```

#### 🏗️ Test File Structure
```
__tests__/
├── components/
│   ├── AudioPlayback.test.tsx
│   ├── FiltersPanel.test.tsx
│   ├── UnifiedSidebar.test.tsx
│   └── SceneCanvas.test.tsx
├── lib/
│   ├── dataLoader.test.ts
│   ├── store.test.ts
│   └── utils.test.ts
├── accessibility/
│   ├── memorial.a11y.test.ts
│   └── keyboardNavigation.test.ts
├── performance/
│   ├── particleRendering.test.ts
│   └── memoryUsage.test.ts
├── e2e/
│   ├── memorialWorkflow.spec.ts
│   └── dataLoading.spec.ts
└── __mocks__/
    ├── three.js.ts
    └── dataLoader.ts
```

### Test Categories by Priority

#### 🚨 Critical Tests (Must Have)
1. **Data Loading & Fallback** - API failures, CSV fallback, timeout handling
2. **State Management** - Filter application, playback queue, auto-playback
3. **Component Rendering** - No crashes, proper data display
4. **Accessibility Compliance** - WCAG standards, screen reader support

#### 📊 Important Tests (Should Have)
1. **Performance Benchmarks** - Particle rendering, memory usage
2. **User Interactions** - Filter controls, playback controls, navigation
3. **Error Boundaries** - Graceful failure handling
4. **Cross-browser Compatibility** - Safari vs Chrome behavior

#### 🔮 Enhanced Tests (Nice to Have)
1. **E2E User Journeys** - Complete memorial experience workflows
2. **Visual Regression** - UI consistency across updates
3. **Load Testing** - Performance under high particle counts
4. **Internationalization** - Arabic/English text handling

### Testing Implementation Strategy

#### Phase 1: Foundation (Week 1-2)
```bash
# 1. Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom msw

# 2. Configure Jest
# Create jest.config.js and jest.setup.js

# 3. Set up test environment
# Configure test scripts in package.json
# Set up MSW for API mocking
# Create test utilities and helpers
```

#### Phase 2: Core Testing (Week 3-4)
```bash
# 1. Data loading tests
# 2. State management tests
# 3. Component rendering tests
# 4. Accessibility compliance tests
```

#### Phase 3: Integration & E2E (Week 5-6)
```bash
# 1. End-to-end user workflows
# 2. Performance benchmarking
# 3. Cross-browser testing
# 4. Accessibility auditing
```

### Quality Assurance Metrics

#### 📊 Coverage Targets
- **Unit Tests**: 80%+ code coverage
- **Component Tests**: 100% of interactive components
- **Accessibility Tests**: 100% WCAG AA compliance
- **E2E Tests**: All critical user journeys

#### 🎯 Success Criteria
- [ ] All tests pass on CI/CD pipeline
- [ ] No accessibility violations (Lighthouse score > 95)
- [ ] Performance benchmarks met (30+ FPS)
- [ ] Data loading reliability (99.9% success rate)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

### Testing Benefits

#### 🐛 **Bug Prevention**
- **Early Detection**: Catch bugs before they reach users
- **Regression Protection**: Prevent memorial data corruption
- **Performance Monitoring**: Maintain smooth 3D experience

#### 🚀 **Development Velocity**
- **Confidence in Refactoring**: Safe code changes with test coverage
- **Documentation**: Tests serve as living documentation
- **Collaboration**: Shared understanding of expected behavior

#### 🌍 **User Trust**
- **Reliability**: Consistent memorial experience across sessions
- **Data Integrity**: Verified casualty data handling
- **Accessibility**: Inclusive experience for all users

#### 📈 **Maintenance**
- **Future-Proofing**: Tests adapt as memorial grows
- **Onboarding**: New developers understand system through tests
- **Continuous Integration**: Automated quality assurance

### Continuous Integration Setup

#### 🔄 GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Quality Assurance
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - run: npm run test:accessibility

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run performance:test

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run accessibility:audit
```

This comprehensive testing strategy will ensure the Gaza Memorial maintains its integrity, performance, and accessibility as it grows and serves more people in honoring the Palestinian lives lost.

## ⚙️ Build Optimization & Performance

### Current Build Configuration Analysis

#### ✅ Current Strengths
- **Next.js 15**: Latest version with App Router and Turbopack
- **TypeScript**: Full type safety and modern JavaScript features
- **Tailwind CSS**: Utility-first CSS with purging
- **ESLint**: Code quality and consistency enforcement
- **GLSL Support**: Custom webpack loader for shader files
- **Radix UI**: Accessible component primitives

#### 📊 Build Performance Assessment
- **Framework**: Next.js 15 with Turbopack (good choice)
- **Styling**: Tailwind CSS v4 (latest, optimized)
- **TypeScript**: Modern configuration
- **Dependencies**: 28 total (reasonable for complex 3D app)

#### 🎯 Optimization Opportunities

##### 1. **Bundle Size Optimization**
**Current Issues**: Large Three.js and React Three Fiber bundles

**Recommendations**:
```typescript
// next.config.mjs - Bundle Analysis & Optimization
import { withBundleAnalyzer } from '@next/bundle-analyzer'

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    // GLSL Shader Support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    })

    // Production optimizations
    if (!dev && !isServer) {
      // Tree shaking for Three.js
      config.resolve.alias = {
        ...config.resolve.alias,
        'three/examples': false,
        'three/addons': false,
      }

      // Remove unused Three.js modules
      config.externals = config.externals || []
      config.externals.push({
        'three/examples': 'commonjs three/examples',
        'three/addons': 'commonjs three/addons',
      })
    }

    return config
  },

  // Enable experimental features
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
    turbo: {
      rules: {
        '*.glsl': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },

  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
      openAnalyzer: true,
    }
  })
}

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer(nextConfig)
  : nextConfig
```

##### 2. **Three.js Optimization**
**Current**: Full Three.js bundle loaded
**Optimization**:
```typescript
// lib/three-optimized.ts - Selective Three.js imports
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Points,
  Vector3,
  Color,
  TextureLoader,
  LinearFilter,
  NearestFilter,
  RepeatWrapping,
  AddEquation,
  OneFactor,
  SrcAlphaFactor,
  OneMinusSrcAlphaFactor,
  CustomBlending,
} from 'three'

// Export only what's needed
export {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Points,
  Vector3,
  Color,
  TextureLoader,
  LinearFilter,
  NearestFilter,
  RepeatWrapping,
  AddEquation,
  OneFactor,
  SrcAlphaFactor,
  OneMinusSrcAlphaFactor,
  CustomBlending,
}

// Replace full Three.js imports in components
// Before: import * as THREE from 'three'
// After: import { Scene, PerspectiveCamera } from '@/lib/three-optimized'
```

##### 3. **Image Optimization**
**Current**: No images in public folder except icons
**Recommendations**:
```typescript
// next.config.mjs - Image optimization
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // WebP conversion for memorial images (when added)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      use: [
        {
          loader: 'next-image-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
          },
        },
      ],
    })
    return config
  }
}
```

##### 4. **Font Optimization**
**Current**: Geist fonts from Google Fonts
**Optimization**:
```typescript
// app/layout.tsx - Optimized font loading
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Prevent invisible text during load
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif']
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only preload if used above fold
  fallback: ['monospace']
});
```

##### 5. **CSS Optimization**
**Current**: Tailwind CSS v4
**Recommendations**:
```css
/* globals.css - Optimized Tailwind imports */
@import "tailwindcss";

/* Only import used Tailwind layers */
@layer base {
  /* Critical CSS only */
}

@layer components {
  /* Component styles */
}

@layer utilities {
  /* Utility classes used in memorial */
}

/* Critical CSS for above-the-fold content */
@supports (color: oklch(0% 0 0)) {
  :root {
    --color-primary: oklch(60% 0.2 240);
  }
}

/* Remove unused CSS */
.purge-css {
  /* Only keep classes used in components */
}
```

##### 6. **Service Worker & Caching**
**Recommendation**: Add service worker for offline memorial access
```typescript
// public/sw.js - Service Worker for offline access
const CACHE_NAME = 'gaza-memorial-v1'
const urlsToCache = [
  '/',
  '/memorial-data.json',
  '/manifest.json',
  // Add other critical assets
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      }
    )
  )
})
```

##### 7. **Build Performance Monitoring**
**Setup**: Bundle analyzer and performance monitoring
```bash
# package.json - Performance monitoring scripts
{
  "scripts": {
    "build:analyze": "ANALYZE=true npm run build",
    "build:performance": "npm run build && npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json",
    "size-check": "npx bundle-analyzer build/static/chunks/*.js"
  }
}
```

### Implementation Priority

#### 🚨 Critical Optimizations (Immediate)
1. **Three.js Tree Shaking** - Reduce bundle size by 60-70%
2. **Bundle Analysis Setup** - Identify largest dependencies
3. **Critical CSS Extraction** - Improve first paint

#### 📊 Important Optimizations (Soon)
1. **Image Optimization** - When memorial images are added
2. **Font Optimization** - Reduce font loading impact
3. **Service Worker** - Enable offline functionality

#### 🔮 Advanced Optimizations (Future)
1. **Code Splitting** - Dynamic imports for heavy components
2. **WebAssembly** - Physics calculations optimization
3. **Edge Computing** - API response optimization

### Performance Benchmarks

#### 📊 Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB (gzipped)
- **Lighthouse Score**: > 90

#### 🎯 Success Criteria
- [ ] Bundle size reduced by 40%+
- [ ] Three.js optimized imports implemented
- [ ] Web Vitals scores meet targets
- [ ] Build time under 30 seconds
- [ ] Development server starts in < 5 seconds

### Build Optimization Workflow

#### 🔄 Continuous Optimization
```yaml
# .github/workflows/bundle-analysis.yml
name: Bundle Analysis
on: pull_request

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:analyze
      - uses: codacy/git-version@2.7.1
        with:
          release-branch: main
      - run: npx bundle-analyzer build/static/chunks/*.js --save-bundle-analysis
```

#### 📈 Performance Monitoring
```typescript
// lib/performance.ts - Runtime performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  measure(metricName: string, value: number) {
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, [])
    }
    this.metrics.get(metricName)!.push(value)
  }

  getAverage(metricName: string): number {
    const values = this.metrics.get(metricName) || []
    return values.reduce((a, b) => a + b, 0) / values.length
  }

  report() {
    console.group('🚀 Performance Metrics')
    for (const [metric, values] of this.metrics) {
      console.log(`${metric}: ${this.getAverage(metric).toFixed(2)}ms (n=${values.length})`)
    }
    console.groupEnd()
  }
}
```

### Benefits of Build Optimization

#### ⚡ **User Experience**
- **Faster Loading**: Reduced bundle size and optimized assets
- **Better Performance**: Smoother 3D rendering and interactions
- **Offline Access**: Service worker enables offline memorial viewing
- **Mobile Friendly**: Optimized for various device capabilities

#### 🛠️ **Developer Experience**
- **Faster Builds**: Optimized build process and caching
- **Better Debugging**: Bundle analysis identifies bottlenecks
- **Predictable Performance**: Consistent loading across environments
- **Maintainability**: Modular optimization approach

#### 🌍 **Scalability**
- **Future-Proof**: Optimization foundation for growing memorial
- **Cost Efficiency**: Reduced bandwidth and hosting costs
- **Global Access**: Optimized for various network conditions
- **Device Compatibility**: Works across different hardware capabilities

### Migration Strategy

#### Phase 1: Foundation (Week 1)
- [ ] Set up bundle analyzer
- [ ] Implement Three.js tree shaking
- [ ] Create performance monitoring utilities
- [ ] Establish performance benchmarks

#### Phase 2: Optimization (Week 2)
- [ ] Optimize font loading
- [ ] Implement critical CSS extraction
- [ ] Add service worker for offline access
- [ ] Set up automated performance testing

#### Phase 3: Monitoring (Week 3)
- [ ] Implement continuous bundle analysis
- [ ] Set up performance monitoring dashboard
- [ ] Create optimization documentation
- [ ] Establish performance regression alerts

This comprehensive build optimization plan will ensure the Gaza Memorial delivers exceptional performance while maintaining its powerful message and reaching audiences worldwide with fast, accessible, and reliable experiences.

## 🛡️ Error Handling & Reliability

### Robust Data Loading Strategy

#### 🔄 Fallback System Architecture
```
API Request → CSV Backup → Graceful Degradation
     ↓            ↓              ↓
 Success    Success       Empty State
     ↓            ↓              ↓
  Display     Display      Show Message
```

#### 🌐 Network Resilience
- **Timeout Protection**: 15-second timeout for all API requests
- **Parallel Fetching**: `Promise.allSettled()` ensures partial failures don't break everything
- **Retry Logic**: Automatic fallback to CSV when APIs are unavailable
- **Offline Support**: CSV files enable full functionality without internet

#### 📊 Error Handling Patterns

##### API Failure Recovery
```typescript
// Primary API attempt
try {
  const response = await fetchWithTimeout(url, 15000)
  return await response.json()
} catch (error) {
  console.error('API failed:', error)

  // Fallback to CSV
  try {
    const csvData = await loadCSVFromPublic(filename)
    return csvData
  } catch (csvError) {
    console.warn('CSV fallback also failed:', csvError)
    return [] // Graceful degradation
  }
}
```

##### Data Validation
- **Type Checking**: Runtime validation of API responses
- **Sanitization**: Clean and normalize data from multiple sources
- **Bounds Checking**: Prevent array access errors
- **Default Values**: Safe fallbacks for missing data

##### User Experience
- **Loading States**: Clear progress indicators during data fetching
- **Error Messages**: User-friendly notifications for failures
- **Partial Data**: Show available data even if some sources fail
- **Recovery Options**: Manual refresh and retry mechanisms

### Reliability Features

#### 🔧 System Stability
- **Memory Management**: Efficient cleanup and garbage collection
- **Resource Limits**: Particle count limits prevent browser crashes
- **Frame Rate Control**: Physics calculations skip frames for stability
- **Audio Fallback**: Graceful degradation when Web Audio API unavailable

#### 📱 Cross-Browser Compatibility
- **Safari Optimization**: Reduced particle limits for WebKit
- **Audio Context**: Fallback for different browser implementations
- **Touch Support**: Mobile-friendly interaction patterns
- **Responsive Design**: Adapts to different screen sizes

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect GitHub**: Link your repository to Vercel
2. **Auto-deploy**: Vercel will automatically deploy on pushes
3. **Custom domain**: Add your own domain if desired

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Performance Testing
```bash
# Test build performance
npm run build -- --analyze

# Bundle size analysis
npx webpack-bundle-analyzer
```

## 🤝 Contributing

We welcome contributions to improve the memorial:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas for Contribution
- **New data sources**: Additional humanitarian data
- **Enhanced visualizations**: New particle effects or shaders
- **Accessibility improvements**: Better screen reader support
- **Performance optimizations**: Better rendering efficiency
- **Mobile optimization**: Improved mobile experience

## 📊 Data Sources

### Primary APIs
- **Tech for Palestine**: Real-time casualty data
- **Infrastructure Damage**: Building destruction data
- **West Bank Incidents**: Regional conflict data

### Local Fallback
- **CSV backups**: Offline functionality
- **Historical data**: Archived information
- **Manual updates**: Data maintenance scripts

## 🎨 Customization

### Adding New Shaders
1. Create new GLSL files in `src/lib/shaders/`
2. Add shader mode to `SceneCanvas.tsx`
3. Update controls in `UnifiedSidebar.tsx`

### Custom Data Sources
1. Add new data loaders in `src/lib/dataLoader.ts`
2. Create CSV backups in `public/`
3. Update fallback logic

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Humanitarian organizations** providing data
- **Three.js community** for graphics inspiration
- **Open source contributors** enabling this work
- **All who have lost loved ones** - this memorial is for you

## 📞 Contact

For questions, contributions, or collaboration opportunities:

- **GitHub Issues**: [Report bugs or request features](https://github.com/latentsmurf/gazasphere/issues)
- **GitHub Discussions**: [Community conversations](https://github.com/latentsmurf/gazasphere/discussions)

---

**"Each particle tells a story. Together, they honor a legacy."** 🇵🇸

*Built with love, respect, and hope for peace.*
