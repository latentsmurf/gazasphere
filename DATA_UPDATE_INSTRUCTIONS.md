# Gaza Memorial Data Update Instructions

## Weekly Data Update Process

The memorial uses a local JSON file for the casualty data, which should be updated weekly to ensure the most current information is displayed.

### Location of Data File
- **File**: `public/gaza-memorial-data.json`
- **Source**: Tech for Palestine API
- **Update Frequency**: Weekly (recommended)

### How to Update the Data

#### Option 1: Using Terminal/Command Line
```bash
# Navigate to the project directory
cd gaza-info-viz

# Download the latest data
curl -s "https://data.techforpalestine.org/api/v2/killed-in-gaza.min.json" -o public/gaza-memorial-data.json

# Verify the file was updated
ls -la public/gaza-memorial-data.json
```

#### Option 2: Manual Download
1. Visit: https://data.techforpalestine.org/api/v2/killed-in-gaza.min.json
2. Save the JSON content to `public/gaza-memorial-data.json`
3. Replace the existing file

### Update the Last Updated Date
After downloading new data, update the date in the code:

1. **Open**: `src/lib/dataLoader.ts`
2. **Find**: The line with `lastUpdated: 'December 30, 2024'`
3. **Update**: Change the date to the current date
4. **Format**: Use format like "January 15, 2025"

### Verification Steps
After updating the data:

1. **Check file size**: The file should be several MB in size
2. **Verify JSON format**: Ensure the file contains valid JSON data
3. **Update the date**: Change the `lastUpdated` field in `src/lib/dataLoader.ts`
4. **Test the application**: 
   - Start the development server: `npm run dev`
   - Check that the memorial loads properly
   - Verify the count of names matches expectations
   - Confirm the "Last updated" date appears correctly

### Data Structure
The JSON file contains an array of objects with the following structure:
```json
{
  "en_name": "English Name",
  "name": "Arabic Name",
  "age": 25,
  "dob": "1998-01-01",
  "sex": "m",
  "id": "unique_id",
  "source": "u"
}
```

### Source Codes
- `h`: Palestinian Ministry of Health
- `c`: Community Public Submission  
- `j`: Judicial or Parliamentary House Committee
- `u`: Unknown Source

### Troubleshooting
If the memorial shows "Loading memorial data..." indefinitely:
1. Check that `public/gaza-memorial-data.json` exists
2. Verify the JSON file is valid (not corrupted)
3. Check browser console for errors
4. Restart the development server

### Backup
Before updating, consider backing up the current data file:
```bash
cp public/gaza-memorial-data.json public/gaza-memorial-data-backup-$(date +%Y%m%d).json
```

### Memorial Impact
Each update ensures that:
- New names are added to honor recently documented casualties
- The memorial count reflects the most current data
- Families and communities see their loved ones represented
- The memorial serves as an accurate historical record

---

*This memorial honors every life lost. Each weekly update ensures no one is forgotten.*
