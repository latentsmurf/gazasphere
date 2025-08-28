'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useStore } from '@/lib/store'
import { Casualty } from '@/lib/dataLoader'
import { useMemo, useState } from 'react'
import { ChevronRight, ChevronDown, Filter, X, Users, Calendar, FileText, RotateCcw, Search } from 'lucide-react'

interface FiltersPanelProps {
  data: Casualty[]
}

export default function FiltersPanel({ data }: FiltersPanelProps) {
  const { filters, setFilters, isFiltered } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    age: true,
    source: true,
    statistics: false
  })

  const sources = useMemo(() => {
    const uniqueSources = new Set(data.map((d) => d.source))
    return ['all', ...Array.from(uniqueSources)]
  }, [data])

  const ageStats = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 120 }
    const ages = data.map(d => d.age).filter(age => age > 0)
    return {
      min: Math.min(...ages),
      max: Math.max(...ages)
    }
  }, [data])

  const statistics = useMemo(() => {
    if (data.length === 0) return { male: 0, female: 0, children: 0, adults: 0, elderly: 0 }
    
    const male = data.filter(d => d.gender === 'male').length
    const female = data.filter(d => d.gender === 'female').length
    const children = data.filter(d => d.age < 18).length
    const adults = data.filter(d => d.age >= 18 && d.age < 60).length
    const elderly = data.filter(d => d.age >= 60).length
    
    return { male, female, children, adults, elderly }
  }, [data])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const resetFilters = () => {
    setFilters({ 
      gender: 'all', 
      ageRange: [ageStats.min, ageStats.max], 
      source: 'all',
      nameSearch: ''
    })
  }

  return (
    <div className="fixed top-0 right-0 h-full z-20">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-28 ${isExpanded ? 'right-80' : 'right-4'} bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-l-lg transition-all duration-300 shadow-lg border border-gray-600`}
      >
        <div className="flex items-center gap-2">
          <Filter size={20} />
          {isFiltered() && (
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          )}
          {isExpanded ? <ChevronRight size={16} /> : <ChevronRight size={16} className="rotate-180" />}
        </div>
      </button>

      {/* Sidebar Panel */}
      <div className={`h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Filter size={20} />
                Memorial Filters
              </h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Explore the memorial by filtering the data
            </p>
            {isFiltered() && (
              <button
                onClick={resetFilters}
                className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <RotateCcw size={14} />
                Reset All Filters
              </button>
            )}
          </div>

          {/* Filter Sections */}
          <div className="p-6 space-y-6">
            {/* Name Search */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-medium">
                <Search size={16} />
                Name Search
              </div>
              <div className="pl-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name (English or Arabic)..."
                    value={filters.nameSearch}
                    onChange={(e) => setFilters({ nameSearch: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {filters.nameSearch && (
                    <button
                      onClick={() => setFilters({ nameSearch: '' })}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {filters.nameSearch && (
                  <div className="mt-2 text-xs text-gray-400">
                    Searching in both English and Arabic names
                  </div>
                )}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('gender')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <Users size={16} />
                  Gender
                </div>
                {expandedSections.gender ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {expandedSections.gender && (
                <div className="pl-6 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'male', 'female'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setFilters({ gender: gender as any })}
                        className={`px-3 py-2 text-sm rounded transition-colors ${
                          filters.gender === gender
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Male: {statistics.male.toLocaleString()}</div>
                    <div>Female: {statistics.female.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Age Filter */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('age')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <Calendar size={16} />
                  Age Range
                </div>
                {expandedSections.age ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {expandedSections.age && (
                <div className="pl-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>{filters.ageRange[0]} years</span>
                      <span>{filters.ageRange[1]} years</span>
                    </div>
                    <Slider
                      min={ageStats.min}
                      max={ageStats.max}
                      step={1}
                      value={filters.ageRange}
                      onValueChange={(value) => setFilters({ ageRange: value as [number, number] })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{ageStats.min}</span>
                      <span>{ageStats.max}</span>
                    </div>
                  </div>
                  
                  {/* Age Group Quick Filters */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400 font-medium">Quick Filters:</div>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => setFilters({ ageRange: [0, 17] })}
                        className="text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        Children (0-17): {statistics.children.toLocaleString()}
                      </button>
                      <button
                        onClick={() => setFilters({ ageRange: [18, 59] })}
                        className="text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        Adults (18-59): {statistics.adults.toLocaleString()}
                      </button>
                      <button
                        onClick={() => setFilters({ ageRange: [60, ageStats.max] })}
                        className="text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        Elderly (60+): {statistics.elderly.toLocaleString()}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Source Filter */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('source')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <FileText size={16} />
                  Data Source
                </div>
                {expandedSections.source ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {expandedSections.source && (
                <div className="pl-6 space-y-3">
                  <Select
                    value={filters.source}
                    onValueChange={(value) => setFilters({ source: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-600">
                      <SelectItem value="all">All Sources</SelectItem>
                      {sources.slice(1).map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    {sources.slice(1).map((source) => (
                      <div key={source}>
                        {source}: {data.filter(d => d.source === source).length.toLocaleString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Legend */}
            {isFiltered() && (
              <div className="space-y-3">
                <div className="text-white font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                  Color Legend
                </div>
                <div className="pl-6 space-y-2">
                  <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                    <div className="text-xs text-gray-300 mb-2">Filtered particles are colored:</div>
                    <div className="space-y-1 text-xs">
                      {filters.gender === 'male' && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4A90E2' }}></div>
                          <span>Male</span>
                        </div>
                      )}
                      {filters.gender === 'female' && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E24A90' }}></div>
                          <span>Female</span>
                        </div>
                      )}
                      {filters.ageRange[0] >= 0 && filters.ageRange[1] <= 17 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#50E3C2' }}></div>
                          <span>Children (0-17)</span>
                        </div>
                      )}
                      {filters.ageRange[0] >= 18 && filters.ageRange[1] <= 59 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F5A623' }}></div>
                          <span>Adults (18-59)</span>
                        </div>
                      )}
                      {filters.ageRange[0] >= 60 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#BD10E0' }}></div>
                          <span>Elderly (60+)</span>
                        </div>
                      )}
                      {((filters.gender === 'all' && (filters.ageRange[0] !== 0 || filters.ageRange[1] !== ageStats.max) && 
                        !(filters.ageRange[0] >= 0 && filters.ageRange[1] <= 17) &&
                        !(filters.ageRange[0] >= 18 && filters.ageRange[1] <= 59) &&
                        !(filters.ageRange[0] >= 60)) || filters.nameSearch.trim() !== '') && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7ED321' }}></div>
                          <span>
                            {filters.nameSearch.trim() !== '' ? 'Name Search Results' : 'Filtered Results'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('statistics')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <FileText size={16} />
                  Statistics
                </div>
                {expandedSections.statistics ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {expandedSections.statistics && (
                <div className="pl-6 space-y-3">
                  <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                    <div className="text-sm font-medium text-white mb-2">Memorial Overview</div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Total Records:</span>
                        <span className="font-medium">{data.length.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Age Range:</span>
                        <span className="font-medium">{ageStats.min} - {ageStats.max} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Sources:</span>
                        <span className="font-medium">{sources.length - 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
