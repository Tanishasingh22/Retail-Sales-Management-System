## 1. Backend Architecture

### **Design Goals**
- Load extremely large datasets without memory errors  
- Fast search/filtering  
- Stream-based processing  
- Clean, modular structure  

### **Key Components**
| File | Responsibility |
|------|----------------|
| `/src/index.js` | Express app bootstrapping, route mounting |
| `/src/routes/sales.js` | Sales API route handler |
| `/src/controllers/salesController.js` | Validates request, delegates to service |
| `/src/services/salesService.js` | Core logic for filtering, searching, pagination |
| `/scripts/csv_to_jsonl.js` | Converts CSV to `.jsonl` for streaming |
| `/data/sales.jsonl` | Line-by-line database substitute |

### **Processing Pipeline**
1. Frontend sends query params → `/api/sales?search=&regions=&page=&sortBy=...`
2. `salesController` validates and forwards to service.
3. `salesService` opens the `.jsonl` file as a **read stream**.
4. Each record is parsed, filtered, matched.
5. Matched rows collected → sorted → paginated.
6. Output returned to frontend.

### **Why JSONL?**
- Loads 40K+ records without memory overflow  
- Streams one line at a time  
- Fast for search & filtering  

---

## 2. Frontend Architecture

### **UI Flow**
- User interacts with Search + Filters  
- Component serializes filters → API query  
- API response updates table & pagination  

### **Key Components**
| File | Responsibility |
|------|----------------|
| `/src/services/api.js` | Axios instance + query serialization |
| `/src/pages/SalesPage.jsx` | Main page → triggers API requests, manages state |
| `/src/components/TransactionTable.jsx` | Displays table of results + pagination |
| `/src/components/Filters.jsx` | Multi-select filters, date pickers, search bar |

### **State Management**
- `filters` (search + dropdowns)
- `data` (API result)
- `page` (pagination)

### **API Format**
```js
{
  total,
  items,
  totalPages,
  page,
}
