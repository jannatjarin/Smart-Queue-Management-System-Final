# Frontend Smart Queue Management System (Next.js)

Ei file e frontend (Next.js 14+ App Router) er structure and kon folder/file ki kaj kore ta sohoj bhabe bujhano holo.

## Root Configuration Files

- **`next.config.ts`**: Next.js er main settings ekhane thake. Jemon amra age `BACKEND_URL` er routing (proxing) ekhane set korechi, jate `/api` call korle eta backend e chole jay.
- **`.env`**: Frontend e dorkari environment variables (jemon API URL) ekhane rakha hoy.
- **`package.json`**: Frontend er joto library ba package install kora ache (jemon React, Axios, Tailwind), tader list and scripts ekhane thake.
- **`postcss.config.mjs` & `eslint.config.mjs`**: Code er style and linting (vul dhora) er settings.

## Folders in Frontend

### 1. `app` (App Router)
Next.js er main routing system ekhane kaj kore. Ekhane joto gulo folder toiri kora hobe, totogulo url/web page toiri hobe.
- **`layout.tsx`**: Eta application er main layout. Header, Footer, and Navbar sadharonoto ekhane thake, jate shob page e segula dekhay.
  ```tsx
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <Navbar />
          {children} {/* Ekhane onnano page gulo load hobe */}
        </body>
      </html>
    )
  }
  ```
- **`page.tsx`**: Eta holo home page (`/`).
- **Other folders (like `login`, `dashboard`)**: `app/login/page.tsx` toiri korle `/login` url e gele oi page ta dekha jabe.

### 2. `components`
Ekhane reusable (bar bar babohar kora jay) UI element gulo thake. Jemon Button, Card, Navbar, Modal. Eigula nijossho kono page na, kintu main page gulor bhitor eigula add kora hoy jate code kom likhte hoy.
- **`layout/Navbar.tsx`**: Navbar component jeta header e thake.
- **`ui/Button.tsx`**: Custom button component.

### 3. `lib`
Library ba auxiliary functions thake ekhane. 
- **`axios.ts`**: API call korar jonno code thake. Amra age ekhane dekhlam je API url theke Axios instance toiri kora hoyeche, jate shob jayga theke shohoje API call kora jay, and auth token sathe pathano jay.
  ```typescript
  import axios from 'axios';
  
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // /api
  });
  
  export default api;
  ```

### 4. `public`
Static files, jemon images, icons, fonts ekhane thake. Eigula sorasori website e access kora jay (jemon `<img src="/logo.png" />`).

---
**Work Flow (Kotha theke ki hoy?):**
1. User kono page e gele (jemon `/dashboard`), `app/dashboard/page.tsx` load hoy.
2. Oi page tar bhetor theke koyekta Component (`components/` theke) call kora hoy.
3. Component gulo backend theke data anar jonno `lib/axios.ts` use kore backend e call pathay.
4. Backend theke data ashar por Frontend seta shundor kore user ke show kore.
