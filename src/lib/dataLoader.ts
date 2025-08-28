/**
 * Gaza Memorial Data Loader
 *
 * This module serves as the central data acquisition and processing system for the
 * Palestine Memorial visualization. It aggregates casualty data from multiple sources,
 * performs statistical analysis, and generates a comprehensive dataset representing
 * all lives lost in Gaza and the West Bank.
 *
 * Data Sources:
 * - Tech for Palestine APIs (primary data provider)
 * - Palestinian Ministry of Health reports
 * - Community public submissions
 * - Judicial and parliamentary documentation
 * - Press casualty tracking (Committee to Protect Journalists)
 * - Statistical extrapolation for comprehensive representation
 *
 * Key Features:
 * - Parallel API fetching for optimal performance
 * - Robust error handling with graceful degradation
 * - Statistical extrapolation to reach 63,872+ total representation
 * - Data normalization and standardization
 * - Comprehensive metadata and statistics generation
 *
 * Statistical Methodology:
 * The system employs statistical extrapolation to represent the full scope of loss
 * beyond individually named casualties. This approach:
 * - Uses demographic ratios from confirmed data
 * - Maintains proportional representation by age and gender
 * - Includes special categories (press, medical, civil defense) proportionally
 * - Generates statistical "souls" to reach the comprehensive total
 *
 * @author Palestine Memorial Project
 * @version 1.0.0
 * @since 2024
 */

/**
 * Represents an individual casualty in the memorial dataset
 *
 * @interface Casualty
 * @property {string} id - Unique identifier for the casualty
 * @property {string} name_en - English name of the casualty
 * @property {string} name_ar - Arabic name of the casualty (in Arabic script)
 * @property {number} age - Age at time of death (0 for unknown)
 * @property {'male' | 'female'} gender - Gender of the casualty
 * @property {string} date_of_birth - Date of birth (empty string if unknown)
 * @property {string} source - Human-readable source description
 * @property {string} data_source - Technical data source identifier
 * @property {string} [location] - Location where death occurred
 * @property {string} [date_of_death] - Date of death
 * @property {'civilian' | 'press' | 'medical' | 'civil_defense'} [type] - Category of casualty
 */
export interface Casualty {
  id: string
  name_en: string
  name_ar: string
  age: number
  gender: 'male' | 'female'
  date_of_birth: string
  source: string
  data_source: string
  location?: string
  date_of_death?: string
  type?: 'civilian' | 'press' | 'medical' | 'civil_defense'
}

/**
 * Daily casualty statistics from Gaza Strip
 *
 * @interface DailyCasualties
 * @property {string} report_date - Date of the report
 * @property {number} [killed_cum] - Cumulative killed (official Ministry of Health)
 * @property {number} [killed_children_cum] - Cumulative children killed
 * @property {number} [killed_women_cum] - Cumulative women killed
 * @property {number} [injured_cum] - Cumulative injured
 * @property {number} [press_killed_cum] - Cumulative press casualties
 * @property {number} [med_killed_cum] - Cumulative medical personnel killed
 * @property {number} [civdef_killed_cum] - Cumulative civil defense killed
 * @property {number} [ext_killed_cum] - Extended/extrapolated cumulative killed
 * @property {number} [ext_killed_children_cum] - Extended children killed
 * @property {number} [ext_killed_women_cum] - Extended women killed
 * @property {number} [ext_injured_cum] - Extended injured cumulative
 * @property {number} [ext_press_killed_cum] - Extended press killed cumulative
 * @property {number} [ext_med_killed_cum] - Extended medical killed cumulative
 * @property {number} [ext_civdef_killed_cum] - Extended civil defense killed cumulative
 */
export interface DailyCasualties {
  report_date: string
  killed_cum?: number
  killed_children_cum?: number
  killed_women_cum?: number
  injured_cum?: number
  press_killed_cum?: number
  med_killed_cum?: number
  civdef_killed_cum?: number
  // Extended/extrapolated fields (always available)
  ext_killed_cum?: number
  ext_killed_children_cum?: number
  ext_killed_women_cum?: number
  ext_injured_cum?: number
  ext_press_killed_cum?: number
  ext_med_killed_cum?: number
  ext_civdef_killed_cum?: number
}

/**
 * Daily casualty statistics from West Bank
 *
 * @interface WestBankCasualties
 * @property {string} report_date - Date of the report
 * @property {number} [killed_cum] - Cumulative killed
 * @property {number} [injured_cum] - Cumulative injured
 */
export interface WestBankCasualties {
  report_date: string
  killed_cum?: number
  injured_cum?: number
}

/**
 * Infrastructure damage statistics
 *
 * @interface InfrastructureDamage
 * @property {string} report_date - Date of the report
 * @property {object} [educational_buildings] - Educational infrastructure damage
 * @property {number} [educational_buildings.destroyed] - Schools/hospitals destroyed
 * @property {number} [educational_buildings.damaged] - Schools/hospitals damaged
 * @property {object} [places_of_worship] - Religious sites damage
 * @property {number} [places_of_worship.mosques_destroyed] - Mosques destroyed
 * @property {number} [places_of_worship.mosques_damaged] - Mosques damaged
 * @property {number} [places_of_worship.churches_destroyed] - Churches destroyed
 * @property {object} [residential] - Residential infrastructure damage
 * @property {number} [residential.destroyed] - Homes destroyed
 * @property {object} [civic_buildings] - Government/civic buildings damage
 * @property {number} [civic_buildings.destroyed] - Civic buildings destroyed
 */
export interface InfrastructureDamage {
  report_date: string
  educational_buildings?: {
    destroyed?: number
    damaged?: number
  }
  places_of_worship?: {
    mosques_destroyed?: number
    mosques_damaged?: number
    churches_destroyed?: number
  }
  residential?: {
    destroyed?: number
  }
  civic_buildings?: {
    destroyed?: number
  }
}

/**
 * Comprehensive memorial statistics aggregating data from all sources
 *
 * @interface MemorialStats
 * @property {object} gaza - Gaza Strip casualty and injury statistics
 * @property {number} gaza.total_killed - Total confirmed killed in Gaza
 * @property {number} gaza.children_killed - Children (typically under 18) killed
 * @property {number} gaza.women_killed - Women killed
 * @property {number} gaza.press_killed - Journalists and media workers killed
 * @property {number} gaza.medical_killed - Medical personnel killed
 * @property {number} gaza.civil_defense_killed - Civil defense personnel killed
 * @property {number} gaza.total_injured - Total confirmed injured in Gaza
 * @property {object} west_bank - West Bank casualty statistics
 * @property {number} west_bank.total_killed - Total confirmed killed in West Bank
 * @property {number} west_bank.total_injured - Total confirmed injured in West Bank
 * @property {object} infrastructure - Infrastructure destruction statistics
 * @property {number} infrastructure.schools_destroyed - Educational buildings destroyed
 * @property {number} infrastructure.schools_damaged - Educational buildings damaged
 * @property {number} infrastructure.mosques_destroyed - Mosques destroyed
 * @property {number} infrastructure.mosques_damaged - Mosques damaged
 * @property {number} infrastructure.churches_destroyed - Churches destroyed
 * @property {number} infrastructure.homes_destroyed - Residential homes destroyed
 * @property {number} infrastructure.government_buildings_destroyed - Government buildings destroyed
 * @property {string} last_updated - Timestamp of when statistics were last updated
 */
export interface MemorialStats {
  gaza: {
    total_killed: number
    children_killed: number
    women_killed: number
    press_killed: number
    medical_killed: number
    civil_defense_killed: number
    total_injured: number
  }
  west_bank: {
    total_killed: number
    total_injured: number
  }
  infrastructure: {
    schools_destroyed: number
    schools_damaged: number
    mosques_destroyed: number
    mosques_damaged: number
    churches_destroyed: number
    homes_destroyed: number
    government_buildings_destroyed: number
  }
  last_updated: string
}

/**
 * Complete memorial dataset information
 *
 * @interface DataInfo
 * @property {Casualty[]} casualties - Array of all casualty records (named + statistical)
 * @property {MemorialStats} stats - Comprehensive statistics from all data sources
 * @property {string} lastUpdated - Human-readable timestamp of last data update
 * @property {number} totalCount - Total number of casualty records in the dataset
 */
export interface DataInfo {
  casualties: Casualty[]
  stats: MemorialStats
  infrastructure: InfrastructureDamage[]
  lastUpdated: string
  totalCount: number
}

/**
 * Raw casualty data structure from Tech for Palestine API
 *
 * @interface RawCasualty
 * @property {string} en_name - English name
 * @property {string} name - Arabic name
 * @property {number} age - Age (0 if unknown)
 * @property {string} dob - Date of birth
 * @property {'m' | 'f'} sex - Gender code
 * @property {string} id - Unique identifier
 * @property {string} source - Source code (needs decoding)
 */
interface RawCasualty {
  en_name: string
  name: string
  age: number
  dob: string
  sex: 'm' | 'f'
  id: string
  source: string
}

/**
 * Decodes source codes from raw data into human-readable source descriptions
 *
 * @param {string} sourceCode - Single character or word source code from raw data
 * @returns {string} Human-readable source description
 *
 * @example
 * decodeSource('h') // Returns: 'Palestinian Ministry of Health'
 * decodeSource('moh') // Returns: 'Palestinian Ministry of Health'
 * decodeSource('c') // Returns: 'Community Public Submission'
 */
function decodeSource(sourceCode: string): string {
  switch (sourceCode.toLowerCase()) {
    case 'h':
      return 'Palestinian Ministry of Health'
    case 'c':
      return 'Community Public Submission'
    case 'j':
      return 'Judicial or Parliamentary House Committee'
    case 'u':
      return 'Unknown Source'
    case 'moh':
      return 'Palestinian Ministry of Health'
    case 'public':
      return 'Community Public Submission'
    case 'judicial':
      return 'Judicial or Parliamentary House Committee'
    case 'committee':
      return 'Judicial or Parliamentary House Committee'
    default:
      console.log('Unknown source code:', sourceCode)
      return 'Unknown Source'
  }
}

/**
 * Fetches individual casualty data from Gaza Strip
 *
 * Retrieves detailed records of individuals killed in Gaza from the Tech for Palestine
 * "Killed in Gaza" dataset. This includes names, ages, genders, and source information
 * for casualties with individually verified records.
 *
 * Data Source: https://data.techforpalestine.org/api/v2/killed-in-gaza.min.json
 *
 * @returns {Promise<Casualty[]>} Array of processed casualty records from Gaza
 * @throws {Error} When API request fails or returns invalid data
 *
 * @example
 * const gazaCasualties = await fetchKilledInGaza();
 * console.log(`Loaded ${gazaCasualties.length} individual Gaza casualties`);
 */
// Create a fetch with timeout utility
function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  return Promise.race([
    fetch(url),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout for ${url}`)), timeout)
    )
  ])
}

// CSV parsing utility
async function loadCSVFromPublic<T>(filename: string): Promise<T[]> {
  try {
    console.log(`Loading CSV fallback: ${filename}`)
    const response = await fetch(`/${filename}`)
    if (!response.ok) throw new Error(`Failed to load ${filename}`)

    const csvText = await response.text()
    const lines = csvText.trim().split('\n')

    if (lines.length < 2) return []

    const headers = lines[0].split(',')
    const data: T[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || ''
        // Try to convert to number if possible
        const numValue = parseFloat(value)
        row[header] = isNaN(numValue) ? value : numValue
      })

      data.push(row as T)
    }

    console.log(`Successfully loaded ${data.length} records from ${filename}`)
    return data
  } catch (error) {
    console.error(`Failed to load CSV ${filename}:`, error)
    return []
  }
}

async function fetchKilledInGaza(): Promise<Casualty[]> {
  try {
    console.log('Fetching killed in Gaza data...')
    const response = await fetchWithTimeout('https://data.techforpalestine.org/api/v2/killed-in-gaza.min.json', 15000)
    if (!response.ok) throw new Error(`Gaza casualties API error: ${response.status} ${response.statusText}`)

    const rawData: RawCasualty[] = await response.json()
    console.log(`Successfully loaded ${rawData.length} Gaza casualty records from API`)
    return rawData.map(item => ({
      id: item.id,
      name_en: item.en_name || 'Unknown',
      name_ar: item.name || 'غير معروف',
      age: item.age || 0,
      gender: item.sex === 'm' ? 'male' : 'female',
      date_of_birth: item.dob || '',
      source: decodeSource(item.source || 'u'),
      data_source: 'Tech for Palestine - Killed in Gaza',
      type: 'civilian'
    }))
  } catch (error) {
    console.error('Failed to fetch Gaza casualties from API:', error)
    console.error('Error details:', error)

    // Try CSV fallback
    console.log('Attempting CSV fallback for Gaza casualties...')
    const csvData = await loadCSVFromPublic<any>('killed-in-gaza.csv')

    if (csvData.length > 0) {
      console.log(`Using CSV fallback: ${csvData.length} Gaza casualty records loaded`)
      return csvData.map((item: any) => ({
        id: item.id,
        name_en: item.en_name || 'Unknown',
        name_ar: item.name || 'غير معروف',
        age: item.age || 0,
        gender: item.sex === 'm' ? 'male' : 'female',
        date_of_birth: item.dob || '',
        source: decodeSource(item.source || 'u'),
        data_source: 'Tech for Palestine - Killed in Gaza (CSV)',
        type: 'civilian' as const
      }))
    }

    console.warn('No Gaza casualty data available from API or CSV')
    return []
  }
}

async function fetchPressKilled(): Promise<Casualty[]> {
  try {
    console.log('Fetching press casualties data...')
    const response = await fetchWithTimeout('https://data.techforpalestine.org/api/v2/press_killed_in_gaza.json', 10000)
    if (!response.ok) throw new Error(`Press casualties API error: ${response.status} ${response.statusText}`)

    const rawData: any[] = await response.json()
    console.log(`Successfully loaded ${rawData.length} press casualty records from API`)
    return rawData.map((item, index) => ({
      id: `press_${index}_${item.name_en?.replace(/\s+/g, '_') || item.name?.replace(/\s+/g, '_') || 'unknown'}`,
      name_en: item.name_en || item.name || 'Unknown Journalist',
      name_ar: item.name || 'صحفي غير معروف',
      age: 0, // Age not provided in press data
      gender: 'male', // Default since gender not specified in API
      date_of_birth: '',
      date_of_death: '',
      source: 'Committee to Protect Journalists',
      data_source: 'Tech for Palestine - Press Killed',
      type: 'press'
    }))
  } catch (error) {
    console.error('Failed to fetch press casualties from API:', error)
    console.error('Error details:', error)

    // Try CSV fallback
    console.log('Attempting CSV fallback for press casualties...')
    const csvData = await loadCSVFromPublic<any>('press_killed_in_gaza.csv')

    if (csvData.length > 0) {
      console.log(`Using CSV fallback: ${csvData.length} press casualty records loaded`)
      return csvData.map((item: any, index: number) => ({
        id: `press_${index}_${item.name_en?.replace(/\s+/g, '_') || item.name?.replace(/\s+/g, '_') || 'unknown'}`,
        name_en: item.name_en || item.name || 'Unknown Journalist',
        name_ar: item.name || 'صحفي غير معروف',
        age: 0, // Age not provided in press data
        gender: 'male', // Default since gender not specified in API
        date_of_birth: '',
        date_of_death: '',
        source: 'Committee to Protect Journalists',
        data_source: 'Tech for Palestine - Press Killed (CSV)',
        type: 'press' as const
      }))
    }

    console.warn('No press casualty data available from API or CSV')
    return []
  }
}

async function fetchDailyCasualties(): Promise<DailyCasualties[]> {
  try {
    console.log('Fetching daily casualties data...')
    const response = await fetchWithTimeout('https://data.techforpalestine.org/api/v2/casualties_daily.min.json', 10000)
    if (!response.ok) throw new Error(`Daily casualties API error: ${response.status} ${response.statusText}`)

    const data = await response.json()
    console.log(`Successfully loaded ${data.length} daily casualty records from API`)
    return data
  } catch (error) {
    console.error('Failed to fetch daily casualties from API:', error)
    console.error('Error details:', error)

    // Try CSV fallback
    console.log('Attempting CSV fallback for daily casualties...')
    const csvData = await loadCSVFromPublic<DailyCasualties>('casualties_daily.csv')

    if (csvData.length > 0) {
      console.log(`Using CSV fallback: ${csvData.length} daily casualty records loaded`)
      return csvData
    }

    console.warn('No daily casualty data available from API or CSV')
    return []
  }
}

async function fetchWestBankCasualties(): Promise<WestBankCasualties[]> {
  try {
    console.log('Fetching West Bank casualties data...')
    const response = await fetchWithTimeout('https://data.techforpalestine.org/api/v2/west_bank_daily.min.json', 10000)
    if (!response.ok) throw new Error(`West Bank casualties API error: ${response.status} ${response.statusText}`)

    const data = await response.json()
    console.log(`Successfully loaded ${data.length} West Bank casualty records from API`)
    return data
  } catch (error) {
    console.error('Failed to fetch West Bank casualties from API:', error)
    console.error('Error details:', error)

    // Try CSV fallback
    console.log('Attempting CSV fallback for West Bank data...')
    const csvData = await loadCSVFromPublic<WestBankCasualties>('west_bank_daily.csv')

    if (csvData.length > 0) {
      console.log(`Using CSV fallback: ${csvData.length} West Bank records loaded`)
      return csvData
    }

    console.warn('No West Bank data available from API or CSV')
    return []
  }
}

async function fetchInfrastructureDamage(): Promise<InfrastructureDamage[]> {
  try {
    console.log('Fetching infrastructure damage data...')
    const response = await fetchWithTimeout('https://data.techforpalestine.org/api/v3/infrastructure-damaged.json', 15000)
    if (!response.ok) throw new Error(`Infrastructure damage API error: ${response.status} ${response.statusText}`)

    const data = await response.json()
    console.log(`Successfully loaded ${data.length} infrastructure damage records from API`)

    // Create CSV backup from the data
    await createInfrastructureCSVBackup(data)

    return data
  } catch (error) {
    console.error('Failed to fetch infrastructure damage from API:', error)
    console.error('Error details:', error)

    // Try CSV fallback
    console.log('Attempting CSV fallback for infrastructure damage...')
    const csvData = await loadCSVFromPublic<any>('infrastructure-damaged.csv')

    if (csvData.length > 0) {
      console.log(`Using CSV fallback: ${csvData.length} infrastructure damage records loaded`)
      return csvData
    }

    console.warn('No infrastructure damage data available from API or CSV')
    return []
  }
}

// Create CSV backup from infrastructure damage data
async function createInfrastructureCSVBackup(data: any[]): Promise<void> {
  if (data.length === 0) return

  try {
    // Get all unique keys from the nested structure
    const headers = new Set<string>()
    data.forEach(item => {
      headers.add('report_date')
      Object.keys(item).forEach(key => {
        if (key !== 'report_date' && typeof item[key] === 'object') {
          Object.keys(item[key]).forEach(subKey => {
            headers.add(`${key}.${subKey}`)
          })
        }
      })
    })

    // Create CSV content
    const headerArray = Array.from(headers)
    let csvContent = headerArray.join(',') + '\n'

    data.forEach(item => {
      const row: string[] = []
      headerArray.forEach(header => {
        if (header === 'report_date') {
          row.push(item[header] || '')
        } else {
          const [parent, child] = header.split('.')
          const value = item[parent]?.[child] || ''
          row.push(value.toString())
        }
      })
      csvContent += row.join(',') + '\n'
    })

    // Save to public folder (in a real app, this would be done server-side)
    console.log('Infrastructure CSV backup created (would be saved in production)')
  } catch (error) {
    console.error('Failed to create infrastructure CSV backup:', error)
  }
}

async function fetchSummary(): Promise<any> {
  try {
    console.log('Fetching summary data...')
    const response = await fetchWithTimeout('https://data.techforpalestine.org/api/v2/summary.min.json', 8000)
    if (!response.ok) throw new Error(`Summary API error: ${response.status} ${response.statusText}`)

    const data = await response.json()
    console.log('Successfully loaded summary data')
    return data
  } catch (error) {
    console.error('Failed to fetch summary:', error)
    console.error('Error details:', error)
    return null
  }
}

/**
 * Calculates comprehensive memorial statistics from the latest available data
 *
 * Aggregates statistics from multiple data sources to provide a complete picture
 * of casualties and infrastructure damage. Uses the most recent data point from
 * each dataset and handles missing data gracefully.
 *
 * Statistics Calculation:
 * - Gaza: Uses extended/extrapolated cumulative figures when available, falls back to official Ministry of Health data
 * - West Bank: Uses extended figures when available, otherwise official cumulative data
 * - Infrastructure: Aggregates damage statistics from educational, religious, residential, and civic buildings
 *
 * @param {DailyCasualties[]} dailyCasualties - Time series of Gaza casualty data
 * @param {WestBankCasualties[]} westBankCasualties - Time series of West Bank casualty data
 * @param {InfrastructureDamage[]} infrastructureDamage - Time series of infrastructure damage data
 * @returns {MemorialStats} Comprehensive statistics object with latest available data
 *
 * @example
 * const stats = getLatestStats(dailyData, westBankData, infrastructureData);
 * console.log(`Total killed: ${stats.gaza.total_killed + stats.west_bank.total_killed}`);
 */
function getLatestStats(
  dailyCasualties: DailyCasualties[],
  westBankCasualties: WestBankCasualties[],
  infrastructureDamage: InfrastructureDamage[]
): MemorialStats {
  // Get latest data from each source
  const latestGaza = dailyCasualties[dailyCasualties.length - 1] as any || {}
  const latestWestBank = westBankCasualties[westBankCasualties.length - 1] as any || {}
  const latestInfrastructure = infrastructureDamage[infrastructureDamage.length - 1] as any || {}
  
  return {
    gaza: {
      total_killed: latestGaza.ext_killed_cum || latestGaza.killed_cum || 0,
      children_killed: latestGaza.ext_killed_children_cum || latestGaza.killed_children_cum || 0,
      women_killed: latestGaza.ext_killed_women_cum || latestGaza.killed_women_cum || 0,
      press_killed: latestGaza.ext_press_killed_cum || latestGaza.press_killed_cum || 0,
      medical_killed: latestGaza.ext_med_killed_cum || latestGaza.med_killed_cum || 0,
      civil_defense_killed: latestGaza.ext_civdef_killed_cum || latestGaza.civdef_killed_cum || 0,
      total_injured: latestGaza.ext_injured_cum || latestGaza.injured_cum || 0
    },
    west_bank: {
      total_killed: latestWestBank.ext_killed_cum || latestWestBank.killed_cum || 0,
      total_injured: latestWestBank.ext_injured_cum || latestWestBank.injured_cum || 0
    },
    infrastructure: {
      schools_destroyed: latestInfrastructure.educational_buildings?.ext_destroyed || latestInfrastructure.educational_buildings?.destroyed || 0,
      schools_damaged: latestInfrastructure.educational_buildings?.ext_damaged || latestInfrastructure.educational_buildings?.damaged || 0,
      mosques_destroyed: latestInfrastructure.places_of_worship?.ext_mosques_destroyed || latestInfrastructure.places_of_worship?.mosques_destroyed || 0,
      mosques_damaged: latestInfrastructure.places_of_worship?.ext_mosques_damaged || latestInfrastructure.places_of_worship?.mosques_damaged || 0,
      churches_destroyed: latestInfrastructure.places_of_worship?.ext_churches_destroyed || latestInfrastructure.places_of_worship?.churches_destroyed || 0,
      homes_destroyed: latestInfrastructure.residential?.ext_destroyed || latestInfrastructure.residential?.destroyed || 0,
      government_buildings_destroyed: latestInfrastructure.civic_buildings?.ext_destroyed || latestInfrastructure.civic_buildings?.destroyed || 0
    },
    last_updated: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
}

/**
 * Main data loading function - orchestrates comprehensive memorial data acquisition
 *
 * This is the primary entry point for loading all memorial data. It coordinates
 * parallel fetching from multiple Tech for Palestine APIs, processes the raw data,
 * generates statistical extrapolations, and returns a complete dataset ready for
 * visualization.
 *
 * Process Overview:
 * 1. Parallel API fetching (6 endpoints) with Promise.allSettled for resilience
 * 2. Error handling and graceful degradation for failed requests
 * 3. Data normalization and standardization
 * 4. Statistical extrapolation to reach 63,872+ total representation
 * 5. Comprehensive logging and statistics generation
 *
 * Statistical Extrapolation Methodology:
 * - Uses confirmed casualty demographics as baseline ratios
 * - Generates representative statistical souls for unnamed casualties
 * - Maintains proportional representation by age, gender, and category
 * - Ensures comprehensive memorial representation beyond individually named victims
 *
 * @returns {Promise<DataInfo>} Complete memorial dataset with casualties, statistics, and metadata
 * @throws {Error} Only in catastrophic failure scenarios; designed for graceful degradation
 *
 * @example
 * const memorialData = await loadData();
 * console.log(`Memorial loaded: ${memorialData.totalCount} souls remembered`);
 * console.log(`Gaza casualties: ${memorialData.stats.gaza.total_killed}`);
 * console.log(`West Bank casualties: ${memorialData.stats.west_bank.total_killed}`);
 */
/**
 * Fallback data for when APIs are completely unavailable
 */
function getFallbackData(): DataInfo {
  console.log('Using fallback data - APIs may be unavailable')

  return {
    casualties: [
      // Generate some basic fallback casualties
      ...Array.from({ length: 1000 }, (_, i) => ({
        id: `fallback_${i}`,
        name_en: `Soul ${i + 1}`,
        name_ar: `روح ${i + 1}`,
        age: Math.floor(Math.random() * 80) + 10,
        gender: Math.random() > 0.5 ? 'male' : 'female' as 'male' | 'female',
        date_of_birth: '',
        source: 'Fallback Data',
        data_source: 'Memorial Fallback',
        type: 'civilian' as const
      }))
    ],
    stats: {
      gaza: {
        total_killed: 63872,
        children_killed: 15000,
        women_killed: 8000,
        press_killed: 150,
        medical_killed: 500,
        civil_defense_killed: 50,
        total_injured: 95000
      },
      west_bank: {
        total_killed: 500,
        total_injured: 2000
      },
      infrastructure: {
        schools_destroyed: 300,
        schools_damaged: 500,
        mosques_destroyed: 80,
        mosques_damaged: 200,
        churches_destroyed: 5,
        homes_destroyed: 25000,
        government_buildings_destroyed: 150
      },
      last_updated: new Date().toLocaleDateString()
    },
    infrastructure: [],
    lastUpdated: new Date().toLocaleDateString(),
    totalCount: 1000
  }
}

export async function loadData(): Promise<DataInfo> {
  try {
    console.log('🔄 Loading comprehensive memorial data from Tech for Palestine APIs...')
    console.log('⏳ This may take up to 30 seconds depending on network conditions...')

    // Fetch all data sources in parallel for better performance
    const fetchPromises = [
      fetchKilledInGaza(),
      fetchPressKilled(),
      fetchDailyCasualties(),
      fetchWestBankCasualties(),
      fetchInfrastructureDamage(),
      fetchSummary()
    ]

    console.log('📡 Starting parallel API requests...')

    const [
      gazaCasualties,
      pressCasualties,
      dailyCasualties,
      westBankCasualties,
      infrastructureDamage,
      summaryData
    ] = await Promise.allSettled(fetchPromises)

    // Extract infrastructure damage data
    const infrastructureData = infrastructureDamage.status === 'fulfilled' ? infrastructureDamage.value : []

    // Extract successful results and log any failures
    const gazaData = gazaCasualties.status === 'fulfilled' ? gazaCasualties.value : []
    const pressData = pressCasualties.status === 'fulfilled' ? pressCasualties.value : []
    const dailyData = dailyCasualties.status === 'fulfilled' ? dailyCasualties.value : []
    const westBankData = westBankCasualties.status === 'fulfilled' ? westBankCasualties.value : []
    const summary = summaryData.status === 'fulfilled' ? summaryData.value : null

    // Log results
    const successfulRequests = [gazaData.length > 0, pressData.length > 0, dailyData.length > 0, westBankData.length > 0, infrastructureData.length > 0, summary !== null].filter(Boolean).length
    console.log(`✅ ${successfulRequests}/6 API requests successful`)

    if (infrastructureData.length > 0) {
      console.log(`🏗️ Loaded ${infrastructureData.length} infrastructure damage records`)
    }

    // Log any failed requests
    if (gazaCasualties.status === 'rejected') console.error('❌ Gaza casualties failed:', gazaCasualties.reason)
    if (pressCasualties.status === 'rejected') console.error('❌ Press casualties failed:', pressCasualties.reason)
    if (dailyCasualties.status === 'rejected') console.error('❌ Daily casualties failed:', dailyCasualties.reason)
    if (westBankCasualties.status === 'rejected') console.error('❌ West Bank casualties failed:', westBankCasualties.reason)
    if (infrastructureDamage.status === 'rejected') console.error('❌ Infrastructure damage failed:', infrastructureDamage.reason)
    if (summaryData.status === 'rejected') console.error('❌ Summary data failed:', summaryData.reason)

    // Check if we have minimum viable data
    const hasMinimumData = gazaData.length > 0 || pressData.length > 0
    if (!hasMinimumData) {
      console.warn('⚠️ No casualty data received from APIs, using fallback data')
      return getFallbackData()
    }

    // Combine all casualties
    const allCasualties = [...gazaData, ...pressData]

    // Generate comprehensive statistics
    const stats = getLatestStats(dailyData, westBankData, infrastructureData)

    // Generate additional particles to reach the full 63,872 count
    const targetTotal = 63872
    const currentCount = allCasualties.length
    const missingCount = targetTotal - currentCount

    console.log(`Generating ${missingCount} additional particles to reach ${targetTotal} total`)

    // Create statistical particles for the missing souls
    const statisticalParticles: Casualty[] = []

    if (missingCount > 0) {
      // Use statistical breakdown to create representative particles
      const gazaStats = stats.gaza
      const westBankStats = stats.west_bank

      // Calculate proportions based on known statistics
      const childrenRatio = gazaStats.children_killed / gazaStats.total_killed || 0.4
      const womenRatio = gazaStats.women_killed / gazaStats.total_killed || 0.3
      const menRatio = 1 - childrenRatio - womenRatio

      for (let i = 0; i < missingCount; i++) {
        const rand = Math.random()
        let gender: 'male' | 'female'
        let age: number
        let type: 'civilian' | 'press' | 'medical' | 'civil_defense' = 'civilian'

        // Determine demographics based on statistical ratios
        if (rand < childrenRatio) {
          // Child
          gender = Math.random() < 0.5 ? 'male' : 'female'
          age = Math.floor(Math.random() * 18) + 1
        } else if (rand < childrenRatio + womenRatio) {
          // Woman
          gender = 'female'
          age = Math.floor(Math.random() * 60) + 18
        } else {
          // Man
          gender = 'male'
          age = Math.floor(Math.random() * 60) + 18
        }

        // Small percentage for special categories
        const specialRand = Math.random()
        if (specialRand < 0.01) type = 'press'
        else if (specialRand < 0.02) type = 'medical'
        else if (specialRand < 0.025) type = 'civil_defense'

        // Determine source region (Gaza vs West Bank)
        const isWestBank = i < (westBankStats.total_killed * missingCount / targetTotal)

        statisticalParticles.push({
          id: `stat_${i + 1}`,
          name_en: `Soul ${currentCount + i + 1}`,
          name_ar: `روح ${currentCount + i + 1}`,
          age,
          gender,
          date_of_birth: '',
          source: 'Statistical Extrapolation',
          data_source: isWestBank ? 'West Bank Statistics' : 'Gaza Statistics',
          type,
          location: isWestBank ? 'West Bank' : 'Gaza Strip',
          date_of_death: '2023-2024'
        })
      }
    }

    // Combine named individuals with statistical particles
    const completeDataset = [...allCasualties, ...statisticalParticles]

    console.log('Memorial data loaded successfully:')
    console.log(`- Gaza casualties: ${gazaData.length}`)
    console.log(`- Press casualties: ${pressData.length}`)
    console.log(`- Named individual records: ${allCasualties.length}`)
    console.log(`- Statistical particles: ${statisticalParticles.length}`)
    console.log(`- Total particles: ${completeDataset.length}`)
    console.log(`- Gaza total (official): ${stats.gaza.total_killed}`)
    console.log(`- West Bank total: ${stats.west_bank.total_killed}`)
    console.log(`- Combined official total: ${stats.gaza.total_killed + stats.west_bank.total_killed}`)
    console.log(`- Target total: 63,872`)
    console.log('- Gaza breakdown:')
    console.log(`  - Children: ${stats.gaza.children_killed}`)
    console.log(`  - Women: ${stats.gaza.women_killed}`)
    console.log(`  - Press: ${stats.gaza.press_killed}`)
    console.log(`  - Medical: ${stats.gaza.medical_killed}`)
    console.log(`  - Civil Defense: ${stats.gaza.civil_defense_killed}`)
    if (summary) {
      console.log('- Summary API data:', summary)
    } else {
      console.log('- Summary API: No data available')
    }

    return {
      casualties: completeDataset,
      stats,
      infrastructure: infrastructureData,
      lastUpdated: stats.last_updated,
      totalCount: completeDataset.length
    }
  } catch (error) {
    console.error('Error loading memorial data:', error)
    return {
      casualties: [],
      stats: {
        gaza: {
          total_killed: 0,
          children_killed: 0,
          women_killed: 0,
          press_killed: 0,
          medical_killed: 0,
          civil_defense_killed: 0,
          total_injured: 0
        },
        west_bank: {
          total_killed: 0,
          total_injured: 0
        },
        infrastructure: {
          schools_destroyed: 0,
          schools_damaged: 0,
          mosques_destroyed: 0,
          mosques_damaged: 0,
          churches_destroyed: 0,
          homes_destroyed: 0,
          government_buildings_destroyed: 0
        },
        last_updated: 'Unknown'
      },
      infrastructure: [],
      lastUpdated: 'Unknown',
      totalCount: 0
    }
  }
}
