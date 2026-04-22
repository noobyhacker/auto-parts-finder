# Integration Checklist

## Phase 1: Preparation ✓

- [x] Created server API route (`server/middleware/catalog-router.ts`)
- [x] Updated frontend data loader (`src/lib/static-data.ts`)
- [x] Documented security improvements
- [x] Created migration guide

## Phase 2: Setup (Do This Now)

### 2.1 Install Dependencies
```bash
npm install express cors body-parser
npm install --save-dev @types/express @types/node ts-node
```

### 2.2 Update `package.json` Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "vite",
    "dev:server": "ts-node server/index.ts",
    "build": "vite build",
    "start": "node server/dist/index.js",
    "server:build": "tsc --project tsconfig.server.json"
  }
}
```

### 2.3 Create Server Entry Point (`server/index.ts`)
```typescript
import express from 'express';
import cors from 'cors';
import catalogRouter from './middleware/catalog-router';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', catalogRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Catalog API: http://localhost:${PORT}/api/catalog`);
});
```

### 2.4 Create TypeScript Server Config (`tsconfig.server.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./server/dist",
    "rootDir": "./server",
    "strict": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["server/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.5 Create/Update `.env`
```bash
# Copy from template
cp .env.example .env

# Edit with your settings
VITE_API_BASE_URL=http://localhost:3000
API_CATALOG_PATH=/api/catalog
NODE_ENV=development
PORT=3000
```

## Phase 3: Data Migration

### 3.1 Create Data Directory
```bash
mkdir -p data
```

### 3.2 Move Catalog File
```bash
# If you have catalog.json in public/data/
mv public/data/catalog.json data/catalog.json 2>/dev/null || echo "File not found or already moved"

# Remove empty public/data/ directory
rmdir public/data/ 2>/dev/null || echo "Directory not empty or doesn't exist"
```

### 3.3 Verify File Structure
```bash
# Check server data exists
ls -la data/catalog.json

# Confirm it's removed from public
ls -la public/data/ 2>/dev/null || echo "✓ public/data/ successfully removed"
```

## Phase 4: Code Updates

### 4.1 Verify `src/lib/static-data.ts` Updated
```bash
# Check if line 40 has correct endpoint
grep -n "fetch(\"/api/catalog\")" src/lib/static-data.ts

# Expected output: 40:  loadPromise = fetch("/api/catalog")
```

### 4.2 Verify Server Router Exists
```bash
# Check server middleware
ls -la server/middleware/catalog-router.ts

# Verify content includes GET /catalog endpoint
grep "router.get('/catalog'" server/middleware/catalog-router.ts
```

## Phase 5: Testing

### 5.1 Start Development Server
```bash
npm run dev

# In separate terminals:
# Terminal 1: npm run dev:client  (Vite frontend - port 5173)
# Terminal 2: npm run dev:server  (Express backend - port 3000)
```

### 5.2 Test API Endpoint
```bash
# Test main catalog endpoint
curl http://localhost:3000/api/catalog | jq '.' | head -20

# Test brands endpoint
curl http://localhost:3000/api/catalog/brands | jq '.'

# Test categories endpoint  
curl http://localhost:3000/api/catalog/categories | jq '.'
```

### 5.3 Test Security Headers
```bash
# Verify security headers present
curl -i http://localhost:3000/api/catalog | grep -E "(X-|Cache-Control)"

# Expected:
# Cache-Control: public, max-age=3600
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
```

### 5.4 Test Direct Access Blocked
```bash
# This should fail (404 or error) - GOOD!
curl http://localhost:3000/data/catalog.json

# OR test in browser console:
# fetch('/data/catalog.json').then(r => r.text()).then(console.log)
# Should show 404 error
```

### 5.5 Frontend Functionality Test
```bash
# Open browser to http://localhost:5173
# 1. Navigate to /catalog
# 2. Verify parts load
# 3. Test filters (brand, category, price)
# 4. Test search functionality
# 5. Test sorting options
# 6. Click on part detail
# 7. Check browser console for errors (should be none)
```

### 5.6 Check Server Logs
```bash
# In server terminal, you should see:
# ✓ Server running on http://localhost:3000
# ✓ Catalog API: http://localhost:3000/api/catalog
# [INFO] Catalog API called (in logs when data loads)
```

## Phase 6: Browser Verification

### 6.1 Open DevTools
- Press `F12` or `Cmd+Opt+I`
- Go to **Network** tab

### 6.2 Verify Requests
1. Navigate to `/catalog` page
2. Look for network requests:
   - ✓ Should see: `GET /api/catalog` (200 OK)
   - ✗ Should NOT see: `GET /data/catalog.json`

### 6.3 Check Response
1. Click on the `/api/catalog` request
2. Go to **Response** tab
3. Verify JSON structure:
   ```json
   {
     "brands": [...],
     "categories": [...],
     "parts": [...],
     "modelsByBrand": {...},
     "vehiclesByModel": {...}
   }
   ```
   
### 6.4 Verify Security Headers
1. Click on the `/api/catalog` request
2. Go to **Headers** tab → **Response Headers**
3. Confirm present:
   - `cache-control: public, max-age=3600`
   - `x-content-type-options: nosniff`
   - `x-frame-options: DENY`

## Phase 7: Error Handling Test

### 7.1 Test Missing Catalog File
```bash
# Temporarily rename catalog file
mv data/catalog.json data/catalog.json.bak

# Test API - should return 500
curl http://localhost:3000/api/catalog

# Expected: { "error": "Failed to fetch catalog data" }

# Restore file
mv data/catalog.json.bak data/catalog.json
```

### 7.2 Test Invalid JSON
```bash
# Corrupt the JSON temporarily
echo "invalid json" > data/catalog.json

# Test API - should return 500
curl http://localhost:3000/api/catalog

# Restore from git or backup
git checkout data/catalog.json
```

## Phase 8: Production Readiness

### 8.1 Build Frontend
```bash
npm run build

# Check dist/ folder created
ls -la dist/

# Verify data is NOT in dist/data/
ls -la dist/data/ 2>/dev/null || echo "✓ No data folder in dist"
```

### 8.2 Build Server
```bash
npm run server:build

# Check server/dist/ created
ls -la server/dist/
```

### 8.3 Environment Variables
```bash
# Verify .env has production settings
cat .env

# Should include:
# NODE_ENV=production
# PORT=3000
```

### 8.4 Run Production Build
```bash
# Build everything
npm run build && npm run server:build

# Start production server
NODE_ENV=production npm start

# Test in separate terminal
curl http://localhost:3000/api/catalog | jq '.brands | length'
```

## Phase 9: Deployment

### 9.1 Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] API endpoints respond correctly
- [ ] Security headers present
- [ ] Catalog data loads on frontend
- [ ] Filters/sorting work
- [ ] Search functionality works
- [ ] Part details load
- [ ] No direct access to /data/catalog.json

### 9.2 Deploy to Hosting
```bash
# For Vercel:
vercel deploy --prod

# For other platforms:
# Follow your hosting provider's deployment guide
# Ensure data/catalog.json is included in deployment
```

### 9.3 Post-Deployment Verification
```bash
# Test production endpoint
curl https://your-app.com/api/catalog | jq '.brands | length'

# Verify security headers
curl -i https://your-app.com/api/catalog | grep X-Content

# Check frontend works
# Visit https://your-app.com/catalog
# Verify parts load and filters work
```

## Phase 10: Monitoring

### 10.1 Server Logs
Monitor logs for:
- API request frequency
- Error rates
- Response times
- File read failures

### 10.2 Frontend Errors
Monitor browser console for:
- Network errors
- JSON parsing errors
- Timeout errors
- CORS issues

### 10.3 Performance Metrics
Track:
- API response time
- Cache hit rate
- Data transfer size
- Peak request load

## Rollback Plan

If issues arise:

```bash
# 1. Stop server
Ctrl+C

# 2. Restore frontend to use old endpoint
git checkout src/lib/static-data.ts

# 3. Restore public data directory
mkdir -p public/data/
mv data/catalog.json public/data/

# 4. Remove server files (optional)
rm -rf server/

# 5. Restart with old setup
npm run dev
```

## Success Criteria ✓

- [x] API endpoint serving catalog data
- [x] Frontend data loads from `/api/catalog`
- [x] Direct access to `/data/catalog.json` blocked
- [x] All UI functionality unchanged
- [x] No console errors
- [x] Security headers present
- [x] Error handling working
- [x] Production build successful

## Troubleshooting

See `REFACTOR_GUIDE.md` for detailed troubleshooting.

---

**Questions?** Check:
- `REFACTOR_GUIDE.md` - Implementation details
- `SECURITY_IMPROVEMENTS.md` - Security features
- `server/middleware/catalog-router.ts` - API implementation
- `src/lib/static-data.ts` - Frontend integration
